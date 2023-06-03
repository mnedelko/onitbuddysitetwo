import type { ListItemProps } from '@mui/material';
import type { Wallet } from '@solana/wallet-adapter-react';
import type { FC, MouseEventHandler } from 'react';
interface WalletListItemProps extends Omit<ListItemProps, 'onClick' | 'button'> {
    onClick: MouseEventHandler<HTMLButtonElement>;
    wallet: Wallet;
}
export declare const WalletListItem: FC<WalletListItemProps>;
export {};
//# sourceMappingURL=WalletListItem.d.ts.map