import { Button } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useCallback, useMemo } from 'react';
import { WalletIcon } from './WalletIcon.js';
export const WalletDisconnectButton = ({ color = 'primary', variant = 'contained', type = 'button', children, disabled, onClick, ...props }) => {
    const { wallet, disconnect, disconnecting } = useWallet();
    const handleClick = useCallback((event) => {
        if (onClick)
            onClick(event);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        if (!event.defaultPrevented)
            disconnect().catch(() => {
                // Silently catch because any errors are caught by the context `onError` handler
            });
    }, [onClick, disconnect]);
    const content = useMemo(() => {
        if (children)
            return children;
        if (disconnecting)
            return 'Disconnecting ...';
        if (wallet)
            return 'Disconnect';
        return 'Disconnect Wallet';
    }, [children, disconnecting, wallet]);
    return (React.createElement(Button, { color: color, variant: variant, type: type, onClick: handleClick, disabled: disabled || !wallet, startIcon: React.createElement(WalletIcon, { wallet: wallet }), ...props }, content));
};
//# sourceMappingURL=WalletDisconnectButton.js.map