import { Request, Response } from 'express';
export declare class ValidatorController {
    getValidatorStats(req: Request, res: Response): Promise<void>;
    getValidators(req: Request, res: Response): Promise<void>;
    private applyFilters;
    getStakeMinimumDelegation(req: Request, res: Response): Promise<void>;
    getLargestAccounts(req: Request, res: Response): Promise<void>;
    getLeaderSchedule(req: Request, res: Response): Promise<void>;
    getSlotLeaders(req: Request, res: Response): Promise<void>;
    getSignatureStatuses(req: Request, res: Response): Promise<void>;
    getTransaction(req: Request, res: Response): Promise<void>;
    getPrioritizationFees(req: Request, res: Response): Promise<void>;
    getTokenAccountsByOwner(req: Request, res: Response): Promise<void>;
    getTokenSupply(req: Request, res: Response): Promise<void>;
    getMultipleAccounts(req: Request, res: Response): Promise<void>;
    subscribeToSignature(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=validator.controller.d.ts.map