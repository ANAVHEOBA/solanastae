import { Request, Response } from 'express';
import { ValidatorFilters } from './validator.schema';
import { ValidatorModel } from './validator.model';

export class ValidatorController {
    async getValidatorStats(req: Request, res: Response) {
        try {
            const stats = await ValidatorModel.getValidatorStats();
            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: stats
            });
        } catch (error) {
            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: 'Failed to fetch validator statistics'
                }
            });
        }
    }

    async getValidators(req: Request, res: Response) {
        try {
            // Parse pagination parameters
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const filters: ValidatorFilters = {
                status: req.query.status as ValidatorFilters['status'],
                minStake: req.query.minStake ? Number(req.query.minStake) : undefined,
                maxCommission: req.query.maxCommission ? Number(req.query.maxCommission) : undefined,
                votePubkey: req.query.votePubkey as string
            };

            let validators = await ValidatorModel.getAllValidators();

            // Apply filters
            validators = this.applyFilters(validators, filters);

            // Apply pagination
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedValidators = validators.slice(startIndex, endIndex);

            // Format response
            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: {
                    current: paginatedValidators.filter(v => v.status === 'active'),
                    delinquent: paginatedValidators.filter(v => v.status === 'delinquent'),
                    pagination: {
                        total: validators.length,
                        page,
                        limit,
                        totalPages: Math.ceil(validators.length / limit)
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: 'Failed to fetch validators'
                }
            });
        }
    }

    private applyFilters(validators: any[], filters: ValidatorFilters) {
        return validators.filter(validator => {
            if (filters.status && filters.status !== 'all' && validator.status !== filters.status) {
                return false;
            }
            if (filters.minStake && validator.activatedStake < filters.minStake) {
                return false;
            }
            if (filters.maxCommission && validator.commission > filters.maxCommission) {
                return false;
            }
            if (filters.votePubkey && validator.votePubkey !== filters.votePubkey) {
                return false;
            }
            return true;
        });
    }
}
