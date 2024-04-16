import React, {useState, useMemo, useCallback, useRef, ReactNode, PropsWithChildren} from 'react'
import omit from 'lodash/omit'

import GatewayContext from './GatewayContext'

// import useEvent from '@polyrize/fe-react-commons/hooks/useEvent'

import type {GatewayRootState, AddContainerHandler} from './types.t'

type GeneralMap<T = unknown> = {[key: string]: T}
type StringToNodes = {[key: string]: ReactNode}

const removeByKey = function <T extends GeneralMap> (keyToRemove: string) {
  return (removeFrom: T) => {
    return omit(removeFrom, [keyToRemove])
  }
}

const getDestNameAndChildId = (gatewayId: string) => {
  return gatewayId.split('##')
}

const verifyDestNameValid = (destName: string) => {
  if (destName.indexOf('##') !== -1) {
    throw new Error('dest names should not have ##')
  }
}

const INITIAL_GATEWAY_STATE = {}
const INITIAL_CONTAINERS_STATE = {}

const GatewayProvider: React.FC<PropsWithChildren> = ({children}) => {
  const currentId = useRef<number>(0)
  const [gateways, setGateways] = useState<StringToNodes>(INITIAL_GATEWAY_STATE)
  const [containers, setContainers] = useState<GeneralMap<AddContainerHandler | undefined>>(INITIAL_CONTAINERS_STATE)

  const getContainerChildren = useCallback((name: string) => {
    return Object.keys(gateways).map(gatewayId => {
      const [destName] = getDestNameAndChildId(gatewayId)
      if (destName !== name) {
        return null
      }
      return gateways[gatewayId]
    })
  }, [gateways])

  const addGateway: GatewayRootState['addGateway'] = useCallback((destName, child, onGatewaySet) => {
    verifyDestNameValid(destName)
    const gatewayId = `${destName}##${currentId.current}`
    currentId.current += 1
    setGateways(prevGateways => ({
      ...prevGateways,
      [gatewayId]: child
    }))
    onGatewaySet(gatewayId)
  }, [setGateways])

  const removeGateway: GatewayRootState['removeGateway'] = useCallback((gatewayId) => {
    setGateways(removeByKey(gatewayId))
    const [destName] = getDestNameAndChildId(gatewayId)
    if (destName in containers && typeof containers[destName] === 'function') {
      (containers[destName] as AddContainerHandler)(getContainerChildren(destName))
    }
  }, [getContainerChildren, containers, setGateways])

  const updateGateway: GatewayRootState['updateGateway'] = useCallback((gatewayId, child) => {
    setGateways(prevGateways => ({
      ...prevGateways,
      [gatewayId]: child
    }))
  }, [setGateways])

  const addContainer: GatewayRootState['addContainer'] = useCallback((name, containerChildrenHandler) => {
    verifyDestNameValid(name)
    setContainers(prevContainers => ({
      ...prevContainers,
      [name]: containerChildrenHandler
    }))
  }, [setContainers])

  const removeContainer: GatewayRootState['removeContainer'] = useCallback((name) => {
    setContainers(removeByKey(name))
  }, [setContainers])

  const contextApi = useMemo<GatewayRootState>(() => ({
    addGateway,
    removeGateway,
    updateGateway,
    addContainer,
    removeContainer,
    getContainerChildren
  }), [addGateway, removeGateway, updateGateway, addContainer, removeContainer, getContainerChildren])

  return (
    <GatewayContext.Provider value={contextApi}>
      {children}
    </GatewayContext.Provider>
  )
}

export default GatewayProvider
