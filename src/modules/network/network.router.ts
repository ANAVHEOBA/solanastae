import { Router, Request, Response } from 'express';
import { NetworkController } from './network.controller';

const router = Router();
const networkController = new NetworkController();

// Get epoch information
router.get('/epoch', async (req: Request, res: Response) => {
    await networkController.getEpochInfo(req, res);
});

// Get inflation rate
router.get('/inflation', async (req: Request, res: Response) => {
    await networkController.getInflationRate(req, res);
});

// Get inflation rewards for addresses
router.get('/rewards', async (req: Request, res: Response) => {
    await networkController.getInflationReward(req, res);
});

// Get network statistics (includes epoch info and inflation rate)
router.get('/stats', async (req: Request, res: Response) => {
    await networkController.getNetworkStats(req, res);
});

// Get account information
router.get('/account', async (req: Request, res: Response) => {
    await networkController.getAccountInfo(req, res);
});

// Get account balance
router.get('/balance', async (req: Request, res: Response) => {
    await networkController.getBalance(req, res);
});

// Get token account balance
router.get('/token-balance', async (req: Request, res: Response) => {
    await networkController.getTokenAccountBalance(req, res);
});

// Subscribe to account updates
router.get('/account/subscribe', async (req: Request, res: Response) => {
    await networkController.subscribeToAccount(req, res);
});

// Unsubscribe from account updates
router.get('/account/unsubscribe', async (req: Request, res: Response) => {
    await networkController.unsubscribeFromAccount(req, res);
});

// Subscribe to vote updates
router.get('/vote/subscribe', async (req: Request, res: Response) => {
    await networkController.subscribeToVotes(req, res);
});

// Unsubscribe from vote updates
router.get('/vote/unsubscribe', async (req: Request, res: Response) => {
    await networkController.unsubscribeFromVotes(req, res);
});

// Subscribe to slot updates
router.get('/slot/subscribe', async (req: Request, res: Response) => {
    await networkController.subscribeToSlots(req, res);
});

// Unsubscribe from slot updates
router.get('/slot/unsubscribe', async (req: Request, res: Response) => {
    await networkController.unsubscribeFromSlots(req, res);
});

// Get program accounts
router.get('/program-accounts', async (req: Request, res: Response) => {
    await networkController.getProgramAccounts(req, res);
});

// Get block production
router.get('/block-production', async (req: Request, res: Response) => {
    await networkController.getBlockProduction(req, res);
});

// Get cluster nodes
router.get('/cluster-nodes', async (req: Request, res: Response) => {
    await networkController.getClusterNodes(req, res);
});

// Get recent performance samples
router.get('/performance-samples', async (req: Request, res: Response) => {
    await networkController.getRecentPerformanceSamples(req, res);
});

// Get supply information
router.get('/supply', async (req: Request, res: Response) => {
    await networkController.getSupply(req, res);
});

// Get version information
router.get('/version', async (req: Request, res: Response) => {
    await networkController.getVersion(req, res);
});

// Get health status
router.get('/health', async (req: Request, res: Response) => {
    await networkController.getHealth(req, res);
});

export const networkRouter = router;
