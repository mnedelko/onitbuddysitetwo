import { styled } from '@mui/material';
import React from 'react';
const Img = styled('img')(({ theme }) => ({
    width: theme.spacing(3),
    height: theme.spacing(3),
}));
export const WalletIcon = ({ wallet, ...props }) => {
    return wallet && React.createElement(Img, { src: wallet.adapter.icon, alt: `${wallet.adapter.name} icon`, ...props });
};
//# sourceMappingURL=WalletIcon.js.map