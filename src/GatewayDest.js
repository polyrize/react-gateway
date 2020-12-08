import React, {useContext, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import GatewayContext from './GatewayContext';

const GatewayDest = ({name, component, unmountOnEmpty, ...attrs}) => {
  const {addContainer, removeContainer, getContainerChildren} = useContext(GatewayContext);
  const children = getContainerChildren(name);
  const nonNullChildren = useMemo(() => children.filter(it => Boolean(it)), [children]);

  useEffect(() => {
    addContainer(name);
    return () => {
      removeContainer(name);
    };
  }, [name]);


  return unmountOnEmpty && !nonNullChildren.length
    ? null
    : React.createElement(component || 'div', attrs, nonNullChildren);
};

GatewayDest.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  unmountOnEmpty: PropTypes.bool
};

export default GatewayDest;
