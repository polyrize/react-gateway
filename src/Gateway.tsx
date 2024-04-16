import React, {useContext, useEffect, useRef} from 'react'

import GatewayContext from './GatewayContext'

import type {GatewayProps} from './types.t'

const Gateway: React.FC<GatewayProps> = ({into, children}) => {
  const gatewayId = useRef<string | null>(null)
  const {addGateway, removeGateway, updateGateway} = useContext(GatewayContext)

  useEffect(() => {
    const onSetGatewayId = (gatewayIdParam: string) => {
      gatewayId.current = gatewayIdParam
    }
    addGateway(into, children, onSetGatewayId)
    return () => {
      if (gatewayId.current) {
        removeGateway(gatewayId.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!gatewayId.current) {
      return
    }
    updateGateway(gatewayId.current, children)
  }, [children])

  return null
}

export default Gateway
