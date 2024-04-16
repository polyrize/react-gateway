import {createContext, type Context} from 'react'

import type {GatewayRootState} from './types.t'

const GatewayContext: Context<GatewayRootState> = createContext<GatewayRootState>({} as unknown as GatewayRootState)

export default GatewayContext
