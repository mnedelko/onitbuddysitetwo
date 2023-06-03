import type { DialogProps } from '@mui/material';
import type { FC, ReactElement } from 'react';
export interface WalletDialogProps extends Omit<DialogProps, 'title' | 'open'> {
    featuredWallets?: number;
    title?: ReactElement;
}
export declare const WalletDialog: FC<WalletDialogProps>;
//# sourceMappingURL=WalletDialog.d.ts.map