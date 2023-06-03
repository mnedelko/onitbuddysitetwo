import { Button } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useCallback, useMemo } from 'react';
import { WalletIcon } from './WalletIcon.js';
export const WalletConnectButton = ({ color = 'primary', variant = 'contained', type = 'button', children, disabled, onClick, ...props }) => {
    const { wallet, connect, connecting, connected } = useWallet();
    const handleClick = useCallback((event) => {
        if (onClick)
            onClick(event);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        if (!event.defaultPrevented)
            connect().catch(() => {
                // Silently catch because any errors are caught by the context `onError` handler
            });
    }, [onClick, connect]);
    const content = useMemo(() => {
        if (children)
            return children;
        if (connecting)
            return 'Connecting ...';
        if (connected)
            return 'Connected';
        if (wallet)
            return 'Connect';
        return 'Connect Wallet';
    }, [children, connecting, connected, wallet]);
    return (React.createElement(Button, { color: color, variant: variant, type: type, onClick: handleClick, disabled: disabled || !wallet || connecting || connected, startIcon: React.createElement(WalletIcon, { wallet: wallet }), ...props }, content));
};
//# sourceMappingURL=WalletConnectButton.js.map