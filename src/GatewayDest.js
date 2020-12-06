import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import PropTypes from 'prop-types';
import GatewayContext from './GatewayContext';

function GatewayDest ({name, component, unmountOnEmpty, ...attrs}) {
  const {addContainer, removeContainer, getContainerChildren} = useContext(GatewayContext);
  const children = getContainerChildren(name);

  useEffect(() => {
    addContainer(name);
    return () => {
      removeContainer(name);
    };
  }, [name]);

  const nonNullChildren = React.useMemo(() => children.filter(it => Boolean(it)), [children])

  return unmountOnEmpty && !nonNullChildren.length
    ? null
    : React.createElement(component || 'div', attrs, nonNullChildren);
}

GatewayDest.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  unmountOnEmpty: PropTypes.bool
};

export default GatewayDest;
