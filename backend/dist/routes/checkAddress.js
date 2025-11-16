import { Router } from 'express';
import { checkAddress } from '../../dist/services/blockchair.js';
const router = Router();
router.post('/check-address', async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({
                error: 'Address is required',
                code: 'MISSING_ADDRESS'
            });
        }
        // Basic address validation
        if (typeof address !== 'string' || address.length < 10) {
            return res.status(400).json({
                error: 'Invalid address format',
                code: 'INVALID_ADDRESS'
            });
        }
        const result = await checkAddress(address);
        res.json(result);
    }
    catch (error) {
        console.error('Error checking address:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
        });
    }
});
export default router;
//# sourceMappingURL=checkAddress.js.map