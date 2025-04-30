import { Request, Response } from 'express';
import { AnalyticsModel } from './analytics.model';
import { PnLRequest, DrawdownRequest } from './analytics.schema';

export class AnalyticsController {
    async calculatePnL(req: Request, res: Response): Promise<void> {
        try {
            const address = req.params.address as string;

            if (!address) {
                res.status(400).json({
                    success: false,
                    message: 'Missing address parameter'
                });
                return;
            }

            const result = await AnalyticsModel.calculatePnL(address);
            res.json(result);
        } catch (error) {
            console.error('[AnalyticsController] Error calculating PnL:', error);
            res.status(500).json({
                success: false,
                message: 'Error calculating PnL',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async calculateDrawdown(req: Request, res: Response): Promise<void> {
        try {
            const address = req.params.address as string;

            if (!address) {
                res.status(400).json({
                    success: false,
                    message: 'Missing address parameter'
                });
                return;
            }

            const result = await AnalyticsModel.calculateDrawdown(address);
            res.json(result);
        } catch (error) {
            console.error('[AnalyticsController] Error calculating drawdown:', error);
            res.status(500).json({
                success: false,
                message: 'Error calculating drawdown',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }





    async calculateSharpeRatio(req: Request, res: Response): Promise<void> {
        try {
            const address = req.params.address as string;

            if (!address) {
                res.status(400).json({
                    success: false,
                    message: 'Missing address parameter'
                });
                return;
            }

            const result = await AnalyticsModel.calculateSharpeRatio(address);
            res.json(result);
        } catch (error) {
            console.error('[AnalyticsController] Error calculating Sharpe Ratio:', error);
            res.status(500).json({
                success: false,
                message: 'Error calculating Sharpe Ratio',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async calculateVolatility(req: Request, res: Response): Promise<void> {
        try {
            const address = req.params.address as string;

            if (!address) {
                res.status(400).json({
                    success: false,
                    message: 'Missing address parameter'
                });
                return;
            }

            const result = await AnalyticsModel.calculateVolatility(address);
            res.json(result);
        } catch (error) {
            console.error('[AnalyticsController] Error calculating Volatility:', error);
            res.status(500).json({
                success: false,
                message: 'Error calculating Volatility',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }




    async calculateSortinoRatio(req: Request, res: Response): Promise<void> {
        try {
            const address = req.params.address as string;

            if (!address) {
                res.status(400).json({
                    success: false,
                    message: 'Missing address parameter'
                });
                return;
            }

            const result = await AnalyticsModel.calculateSortinoRatio(address);
            res.json(result);
        } catch (error) {
            console.error('[AnalyticsController] Error calculating Sortino Ratio:', error);
            res.status(500).json({
                success: false,
                message: 'Error calculating Sortino Ratio',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}


