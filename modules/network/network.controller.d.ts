import { Request, Response } from 'express';
export declare class NetworkController {
    getEpochInfo(req: Request, res: Response): Promise<void>;
    getInflationRate(req: Request, res: Response): Promise<void>;
    getNetworkStats(req: Request, res: Response): Promise<void>;
    getInflationReward(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAccountInfo(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBalance(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getTokenAccountBalance(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProgramAccounts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    subscribeToAccount(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    unsubscribeFromAccount(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    subscribeToVotes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    unsubscribeFromVotes(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    subscribeToSlots(req: Request, res: Response): Promise<void>;
    unsubscribeFromSlots(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getRecentPerformanceSamples(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBlockProduction(req: Request, res: Response): Promise<void>;
    getClusterNodes(req: Request, res: Response): Promise<void>;
    getSupply(req: Request, res: Response): Promise<void>;
    getVersion(req: Request, res: Response): Promise<void>;
    getHealth(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=network.controller.d.ts.map