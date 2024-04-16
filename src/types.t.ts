import type {PropsWithChildren, ReactNode} from 'react'

export interface AddGatewayHandler {
  (id: string): void
}
export interface AddContainerHandler {
  (nodes: ReactNode[]): void
}

type GatewayId = string
type ContainerId = string

export type GatewayRootState = {
  addGateway: (into: GatewayId, children: ReactNode, onSetGatewayId: AddGatewayHandler) => void,
  removeGateway: (id: GatewayId) => void,
  updateGateway: (id: GatewayId, node: ReactNode) => void,
  addContainer: (name: ContainerId, setChildren?: AddContainerHandler) => void,
  removeContainer: (name: ContainerId) => void,
  getContainerChildren: (name: ContainerId) => ReactNode | ReactNode[]
}

export type GatewayProps = {into: string} & JSX.IntrinsicElements['div']

export type GatewayDestProps = {name: string, component?: React.ElementType | string, unmountOnEmpty?: boolean} & JSX.IntrinsicElements['div']
