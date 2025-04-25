import { Request, Response } from 'express';
export declare class SolscanController {
    getAccountDetail(req: Request, res: Response): Promise<void>;
    getAccountTransactions(req: Request, res: Response): Promise<void>;
    getPortfolio(req: Request, res: Response): Promise<void>;
    getTokenAccounts(req: Request, res: Response): Promise<void>;
    getStakeAccounts(req: Request, res: Response): Promise<void>;
    getTransfers(req: Request, res: Response): Promise<void>;
    getDefiActivities(req: Request, res: Response): Promise<void>;
    getTokenMetadataMulti(req: Request, res: Response): Promise<void>;
    getTokenPriceMulti(req: Request, res: Response): Promise<void>;
    getTokenHolders(req: Request, res: Response): Promise<void>;
    getTokenTransfer(req: Request, res: Response): Promise<void>;
    getTokenDefiActivities(req: Request, res: Response): Promise<void>;
    getLastTransactions(req: Request, res: Response): Promise<void>;
    getTransactionDetail(req: Request, res: Response): Promise<void>;
    getTransactionActions(req: Request, res: Response): Promise<void>;
    getLastBlocks(req: Request, res: Response): Promise<void>;
    getBlockTransactions(req: Request, res: Response): Promise<void>;
    getBlockDetail(req: Request, res: Response): Promise<void>;
    getMarketList(req: Request, res: Response): Promise<void>;
    getMarketInfo(req: Request, res: Response): Promise<void>;
    getMarketVolume(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=solscan.controller.d.ts.map