import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
import { SotaWeb3ReactProviderElement } from "./provider";
import { useState, useEffect } from "react";
import { formatEther } from "@ethersproject/units";

export class SotaMetamaskConnector extends InjectedConnector {}

export class SotaWalletConnectConnector extends WalletConnectConnector {}

export const SotaWeb3ReactProvider = SotaWeb3ReactProviderElement as any;

export const useSotaWeb3React = () => {
  const { activate, account, chainId, deactivate, error, library, connector } =
    useWeb3React();

  const tryActivate = async (connector: AbstractConnector) => {
    if (!window.ethereum && connector instanceof SotaMetamaskConnector) {
      window.open("https://metamask.io/");
    }

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof SotaWalletConnectConnector) {
      connector.walletConnectProvider = undefined;
    }

    connector &&
      activate(connector, undefined, true)
        .then(() => {
          console.info("🚀 connect to wallet successfully!");
        })
        .catch((error) => {
          console.error(error.message);
        });
  };

  const [balance, setBalance] = useState();
  useEffect(() => {
    if (!!account && !!library) {
      let stale = false;
      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(undefined);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]);

  const formatAmountToken = formatEther;

  return {
    activate,
    deactivate,
    account,
    chainId,
    error,
    tryActivate,
    library,
    connector,
    balance,
    formatAmountToken,
  };
};
