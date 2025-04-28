import { Request, Response } from 'express';
import { LiquidityMonitorRequest, VolumeMonitorRequest,SwapMonitorRequest } from './liquidity-monitor.schema';
import { liquidityMonitorModel } from './liquidity-monitor.model';

export class LiquidityMonitorController {
    async getLiquidityChanges(req: Request, res: Response): Promise<void> {
        try {
            const request: LiquidityMonitorRequest = {
                pool_address: req.query.pool_address as string,
                program_id: req.query.program_id as string,
                token_address: req.query.token_address as string,
                from_time: req.query.from_time ? Number(req.query.from_time) : undefined,
                to_time: req.query.to_time ? Number(req.query.to_time) : undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                page_size: req.query.page_size ? Number(req.query.page_size) as 10 | 20 | 30 | 40 | 60 | 100 : undefined,
                sort_by: req.query.sort_by as 'timestamp',
                sort_order: req.query.sort_order as 'asc' | 'desc'
            };

            const response = await liquidityMonitorModel.getLiquidityChanges(request);
            res.json(response);
        } catch (error) {
            console.error('Error in getLiquidityChanges:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async startMonitoring(req: Request, res: Response): Promise<void> {
        try {
            const { pool_address } = req.body;
            if (!pool_address) {
                res.status(400).json({
                    success: false,
                    error: 'Pool address is required'
                });
                return;
            }

            await liquidityMonitorModel.startMonitoring(pool_address);
            res.json({
                success: true,
                message: `Started monitoring pool ${pool_address}`
            });
        } catch (error) {
            console.error('Error in startMonitoring:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async getVolumeAnomalies(req: Request, res: Response): Promise<void> {
        try {
            const request: VolumeMonitorRequest = {
                pool_address: req.query.pool_address as string,
                program_id: req.query.program_id as string,
                token_address: req.query.token_address as string,
                from_time: req.query.from_time ? Number(req.query.from_time) : undefined,
                to_time: req.query.to_time ? Number(req.query.to_time) : undefined,
                min_anomaly_score: req.query.min_anomaly_score ? Number(req.query.min_anomaly_score) : undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                page_size: req.query.page_size ? Number(req.query.page_size) as 10 | 20 | 30 | 40 | 60 | 100 : undefined,
                sort_by: req.query.sort_by as 'timestamp' | 'anomaly_score',
                sort_order: req.query.sort_order as 'asc' | 'desc'
            };

            const response = await liquidityMonitorModel.getVolumeAnomalies(request);
            res.json(response);
        } catch (error) {
            console.error('Error in getVolumeAnomalies:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }


    async getSwapActivities(req: Request, res: Response): Promise<void> {
        try {
            const request: SwapMonitorRequest = {
                pool_address: req.query.pool_address as string,
                program_id: req.query.program_id as string,
                token_address: req.query.token_address as string,
                from_time: req.query.from_time ? Number(req.query.from_time) : undefined,
                to_time: req.query.to_time ? Number(req.query.to_time) : undefined,
                min_value: req.query.min_value ? Number(req.query.min_value) : undefined,
                page: req.query.page ? Number(req.query.page) : undefined,
                page_size: req.query.page_size ? Number(req.query.page_size) as 10 | 20 | 30 | 40 | 60 | 100 : undefined,
                sort_by: req.query.sort_by as 'timestamp' | 'value',
                sort_order: req.query.sort_order as 'asc' | 'desc'
            };
    
            const response = await liquidityMonitorModel.getSwapActivities(request);
            res.json(response);
        } catch (error) {
            console.error('Error in getSwapActivities:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}

export const liquidityMonitorController = new LiquidityMonitorController(); 