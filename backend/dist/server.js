import express from 'express';
import cors from 'cors';
import checkAddressRoutes from './routes/checkAddress';
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use('/api', checkAddressRoutes);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Crypto Guardian API server running on port ${PORT}`);
});
export default app;
//# sourceMappingURL=server.js.map