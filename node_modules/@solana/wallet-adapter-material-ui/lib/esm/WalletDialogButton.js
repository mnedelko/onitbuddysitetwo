import { Button } from '@mui/material';
import React, { useCallback } from 'react';
import { useWalletDialog } from './useWalletDialog.js';
export const WalletDialogButton = ({ children = 'Select Wallet', color = 'primary', variant = 'contained', type = 'button', onClick, ...props }) => {
    const { setOpen } = useWalletDialog();
    const handleClick = useCallback((event) => {
        if (onClick)
            onClick(event);
        if (!event.defaultPrevented)
            setOpen(true);
    }, [onClick, setOpen]);
    return (React.createElement(Button, { color: color, variant: variant, type: type, onClick: handleClick, ...props }, children));
};
//# sourceMappingURL=WalletDialogButton.js.map