import { Button, ListItem } from '@mui/material';
import React from 'react';
import { WalletIcon } from './WalletIcon.js';
export const WalletListItem = ({ onClick, wallet, ...props }) => {
    return (React.createElement(ListItem, { ...props },
        React.createElement(Button, { onClick: onClick, endIcon: React.createElement(WalletIcon, { wallet: wallet }) }, wallet.adapter.name)));
};
//# sourceMappingURL=WalletListItem.js.map