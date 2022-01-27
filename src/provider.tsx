import React from 'react'
import { Web3ReactProvider } from "@web3-react/core"
import getLibrary from "./utils/getLibrary"

interface ISotaWeb3ReactProvider {
    children: any
}

export const SotaWeb3ReactProviderElement : React.FC<ISotaWeb3ReactProvider>= ({children}) => {
    return <Web3ReactProvider getLibrary={getLibrary} children={null}>
       {children}
    </Web3ReactProvider>
} 