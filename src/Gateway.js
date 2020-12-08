import React, {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';
import GatewayContext from './GatewayContext';

const Gateway = ({into, children}) => {
  const gatewayId = useRef(null);
  const {addGateway, removeGateway, updateGateway} = useContext(GatewayContext);

  useEffect(() => {
    const onSetGatewayId = (gatewayIdParam) => {
      gatewayId.current = gatewayIdParam;
    };
    addGateway(into, children, onSetGatewayId);
    return () => {
      removeGateway(gatewayId.current);
    };
  }, []);

  useEffect(() => {
    if (!gatewayId.current) {
      return;
    }
    updateGateway(gatewayId.current, children);
  }, [children]);

  return null;
};

Gateway.propTypes = {
  into: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default Gateway;
