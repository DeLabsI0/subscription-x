import React from "react";
import { ethers } from "ethers";
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useEagerConnect, useInactiveListener } from '../hooks'
import { 
  injected, 
  walletconnect,
  walletlink,
  trezor,
  ledger,
  lattice } from '../connectors'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { Spinner } from './Spinner'
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../styles/Portal.module.css';


enum ConnectorNames {
  Injected = 'Injected',
  WalletConnect = 'WalletConnect',
  WalletLink = 'WalletLink',
  Ledger = 'Ledger',
  Trezor = 'Trezor',
  Lattice = 'Lattice'
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Ledger]: ledger,
  [ConnectorNames.Trezor]: trezor,
  [ConnectorNames.Lattice]: lattice
}

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

export const ConnectPanel = () => {
  const context = useWeb3React<Web3Provider>()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return(
    <>
      <h3 style={{textAlign: "center", marginTop: '0.7rem', marginBottom: '0.9rem'}}>Connect your Wallet</h3>
      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '80%',
          margin: 'auto'
        }}
      >
        {Object.keys(connectorsByName).map(name => {
          const currentConnector = connectorsByName[name]
          const activating = currentConnector === activatingConnector
          const connected = currentConnector === connector
          const disabled = !triedEager || !!activatingConnector || connected || !!error

          return (
            <button
              style={{
                height: '3rem',
                borderRadius: '6px',
                border: 'solid 2px',
                borderColor: activating ? 'orange' : connected ? 'steelblue' : 'unset',
                cursor: disabled ? 'unset' : 'pointer',
                position: 'relative',
                backgroundColor: 'black',
                color: 'white'
              }}
              disabled={disabled}
              key={name}
              onClick={() => {
                setActivatingConnector(currentConnector)
                activate(connectorsByName[name])
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  margin: '0 0 0 1rem'
                }}
              >
                {activating && <Spinner color={'red'} style={{ height: '25%', marginLeft: '-1rem' }} />}
                {connected && (<FontAwesomeIcon icon={faCheck} color='red' className={styles.checkStyle} />)}
              </div>
              {name}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {(active || error) && (
          <button
            style={{
              height: '2rem',
              borderRadius: '6px',
              border: 'solid 2px white',
              backgroundColor: 'black',
              color: 'white',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
            onClick={() => {
              deactivate()
            }}
          >
            Disconnect
          </button>
        )}
        {connector === connectorsByName[ConnectorNames.WalletConnect] && (
          <button
            style={{
              height: '3rem',
              borderRadius: '6px',
              border: 'solid 2px black',
              marginTop: '1rem',
              marginBottom: '.5rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            XWalletConnect
          </button>
        )}
        {connector === connectorsByName[ConnectorNames.WalletLink] && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            Kill WalletLink Session
          </button>
        )}
      </div>
      <div>{!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}</div>
    </>

  )
}