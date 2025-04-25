import { Request, Response } from 'express';
export declare class SolanaFMController {
    getTaggedAccounts(req: Request, res: Response): Promise<void>;
    getAccountFees(req: Request, res: Response): Promise<void>;
    getAccountTransactions(req: Request, res: Response): Promise<void>;
    getOwnerTokenAccounts(req: Request, res: Response): Promise<void>;
    getTokenInfo(req: Request, res: Response): Promise<void>;
    getTokenSupply(req: Request, res: Response): Promise<void>;
    getActions(req: Request, res: Response): Promise<void>;
    getTransfer(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=solanafm.controller.d.ts.map