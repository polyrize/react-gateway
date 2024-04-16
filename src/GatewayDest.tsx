import React, {useContext, useEffect, useMemo} from 'react'

import GatewayContext from './GatewayContext'

import type {GatewayDestProps} from './types.t'

const DEFAULT_COMPONENT = 'div'

const GatewayDest: React.FC<GatewayDestProps> = ({name, component, unmountOnEmpty, ...attrs}) => {
  const {addContainer, removeContainer, getContainerChildren} = useContext(GatewayContext)
  const children = getContainerChildren(name)
  const nonNullChildren = useMemo(() => React.Children.toArray(children).filter(Boolean), [children])

  useEffect(() => {
    addContainer(name)
    return () => {
      removeContainer(name)
    }
  }, [name])

  return (unmountOnEmpty && !nonNullChildren.length) ? null : React.createElement(component || DEFAULT_COMPONENT, attrs, nonNullChildren)
}

GatewayDest.defaultProps = {
  component: DEFAULT_COMPONENT,
  unmountOnEmpty: false
}

export default GatewayDest
