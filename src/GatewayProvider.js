import React, {useState, useCallback, useRef} from 'react';
import PropTypes from 'prop-types';
import GatewayContext from './GatewayContext';


const removeByKey = (keyToRemove) => {
	return (removeFrom) => {
		let clone = Object.assign({}, removeFrom);
		delete clone[keyToRemove];
		return clone;
	};
};

const getDestNameAndChildId = (gatewayId) => {
	return gatewayId.split('##');
};

const verifyDestNameValid = (destName) => {
	if (destName.indexOf('##') != -1) {
		throw new Error('dest names should not have ##');
	}
};

const GatewayProvider = ({children}) => {
	const currentId = useRef(0);
	const [gateways, setGateways] = useState({});
	const [containers, setContainer] = useState({});

	const getContainerChildren = useCallback((name) => {
		return Object.keys(gateways)
			.map(gatewayId => {
				const [destName] = getDestNameAndChildId(gatewayId);
				if (destName !== name) {
					return null;
				}
				return gateways[gatewayId];
			});
	}, [gateways]);

	const addGateway = useCallback((destName, child, setGatewayId) => {
		verifyDestNameValid(destName);
		const gatewayId = `${destName}##${currentId.current}`;
		currentId.current += 1;
		setGateways(prevGateways => ({
			...prevGateways,
			[gatewayId]: child
		}));
		setGatewayId(gatewayId);
	}, [setGateways]);

	const removeGateway = useCallback((gatewayId) => {
		setGateways(removeByKey(gatewayId));
		const [destName] = getDestNameAndChildId(gatewayId);
		containers[destName] && containers[destName](
			getContainerChildren(destName)
		);
	}, [getContainerChildren, containers, setGateways]);

	const updateGateway = useCallback((gatewayId, child) => {
		setGateways(prevGateways => ({
			...prevGateways,
			[gatewayId]: child
		}));
	}, [setGateways]);

	const addContainer = useCallback((name, setContainerChildren) => {
		verifyDestNameValid(name);
		setContainer(prevContainers => ({
			...prevContainers,
			[name]: setContainerChildren
		}));
	}, [setContainer]);

	const removeContainer = useCallback((name) => {
		setContainer(removeByKey(name));
	}, [setContainer]);


	const setState = {
		addGateway,
		removeGateway,
		updateGateway,
		addContainer,
		removeContainer,
		getContainerChildren,
	};

	return (
		<GatewayContext.Provider value={setState}>
			{children}
		</GatewayContext.Provider>
	);
};

GatewayProvider.propTypes = {
	children: PropTypes.element,
};

export default GatewayProvider;