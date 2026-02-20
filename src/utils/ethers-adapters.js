
import { useMemo } from 'react';
import { useClient, useConnectorClient } from 'wagmi';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

export function clientToProvider(client) {
    const { chain, transport } = client;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    if (transport.type === 'fallback') {
        return new BrowserProvider(transport.transports[0].value, network);
    }
    return new BrowserProvider(transport, network);
}

export function useEthersProvider({ chainId } = {}) {
    const client = useClient({ chainId });
    return useMemo(() => (client ? clientToProvider(client) : undefined), [client]);
}

export function clientToSigner(client) {
    const { account, chain, transport } = client;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new BrowserProvider(transport, network);
    const signer = new JsonRpcSigner(provider, account.address);
    return signer;
}

export function useEthersSigner({ chainId } = {}) {
    const { data: client } = useConnectorClient({ chainId });
    return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}
