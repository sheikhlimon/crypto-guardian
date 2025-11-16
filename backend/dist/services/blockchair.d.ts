export declare const getAddressInfo: (address: string, blockchain?: string) => Promise<any>;
export declare const getRecentTransactions: (address: string, blockchain?: string) => Promise<any>;
export declare const analyzeSuspiciousPatterns: (addressData: any, transactions: any[]) => {
    findings: string[];
    riskScore: number;
};
export declare const checkAddress: (address: string) => Promise<{
    verdict: string;
    risk_score: number;
    findings: string[];
    transaction_count: any;
    total_value: any;
    recommendation: string;
    address: string;
    blockchain: string;
    balance: any;
}>;
//# sourceMappingURL=blockchair.d.ts.map