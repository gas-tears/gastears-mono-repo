import MetaMaskOnboarding from '@metamask/onboarding';
import { useEffect, useRef, useState } from "react";
import { ChainHexes, MetaMaskNetworkName } from "types";

//TODO: this makes it so that we lose type checking for the window object
declare let window: any

export default function useWalletConnect() {
    const [connectedWallets, setConnectedWallets] = useState<string[]>([])
    const [connectedChain, setConnectedChain] = useState<ChainHexes>("0x1")
    const onboarding = useRef<MetaMaskOnboarding>();

    useEffect(() => {
        if (!onboarding.current) onboarding.current = new MetaMaskOnboarding();

        if (!MetaMaskOnboarding.isMetaMaskInstalled()) return

        const addresses = window.ethereum?._state?.accounts?.length === 0 ? null : window.ethereum?._state?.accounts;
        setConnectedWallets(addresses || []);

        (async () => {
            try {
                const chain = await window.ethereum.request({ method: 'eth_chainId' })
                setConnectedChain(chain)
            } catch (error) {
                console.log(error)
                setConnectedChain("0x1")
            }
        })()


        window.ethereum.on('accountsChanged', setConnectedWallets);
        window.ethereum.on('chainChanged', setConnectedChain);

        return () => {
            window.ethereum.removeListener('accountsChanged', setConnectedWallets)
            window.ethereum.removeListener('chainChanged', setConnectedChain)
        }
    }, []);

    const getWallets = async () => {
        if (!MetaMaskOnboarding.isMetaMaskInstalled()) onboarding?.current?.startOnboarding()

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setConnectedWallets(accounts)
        return accounts
    }

    const changeNetwork = async (chainId: ChainHexes) => {
        if (!MetaMaskOnboarding.isMetaMaskInstalled()) onboarding?.current?.startOnboarding()

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                //TODO: Change chain id to chain name
                alert(`Oops! It seems like you currently don't have the ${chainId} networth installed`)
            }
        }
    }

    const sendTip = async (value: number) => {
        if (!MetaMaskOnboarding.isMetaMaskInstalled()) onboarding?.current?.startOnboarding()
        let wallets = connectedWallets
        if (wallets.length === 0) {
            wallets = await getWallets()
        }

        const transactionParameters = {
            nonce: '0x00', // ignored by MetaMask
            to: "0x9C3F644c6ac48b34B908aA8F4142a3fE8ccCfEa7", // Required except during contract publications.
            from: wallets[0], // must match user's active address.
            value: convertValueToHexString(value * 10 ** 18), // Only required to send ether to the recipient from the initiating external account.
        };

        // txHash is a hex string
        // As with any RPC call, it may throw an error
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
    }

    return {
        getWallets,
        connectedWallets,
        changeNetwork,
        sendTip,
        connectedChain
    }
}

function convertValueToHexString(value: number) {
    return "0x" + value.toString(16)
}


type ChainIdHexes = {
    [C in MetaMaskNetworkName]: string
}

const chainIdHexes: ChainIdHexes = {
    eth: "0x1",
    avax: "0xA86A",
    ftm: "0xFA",
    bnb: "0x38",
    matic: "0x89"
}