import { Shield, AlertTriangle, XCircle, TrendingUp, DollarSign, Activity } from 'lucide-react'
import {
  formatCurrency,
  formatAddress,
  getRiskColor,
  getRiskScoreColor,
  getRiskScoreGradient,
  getRiskScoreTextColor,
  getRiskScoreBgColor,
  getRiskScoreRingColor,
} from '../utils/fp'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import type { AddressCheckResponse } from '../types/api'

interface ResultCardProps {
  result: AddressCheckResponse
}

export default function ResultCard({ result }: ResultCardProps) {
  const riskLevel = result?.verdict?.toLowerCase() || 'unknown'
  const riskColor = getRiskColor(result?.verdict || 'unknown')
  const riskScore = result?.risk_score || 0
  const riskScoreColor = getRiskScoreColor(riskScore)
  const riskScoreGradient = getRiskScoreGradient(riskScore)
  const riskScoreTextColor = getRiskScoreTextColor(riskScore)
  const riskScoreBgColor = getRiskScoreBgColor(riskScore)
  const riskScoreRingColor = getRiskScoreRingColor(riskScore)

  // Get risk level details
  const getRiskDetails = () => {
    switch (riskLevel) {
      case 'clean':
      case 'safe':
        return {
          icon: Shield,
          title: 'Safe Address',
          description: 'This address appears to be safe for transactions',
          variant: 'default' as const,
        }
      case 'suspicious':
        return {
          icon: AlertTriangle,
          title: 'Suspicious Activity',
          description: 'Exercise caution with this address',
          variant: 'secondary' as const,
        }
      case 'malicious':
        return {
          icon: XCircle,
          title: 'High Risk Address',
          description: 'Avoid transactions with this address',
          variant: 'destructive' as const,
        }
      default:
        return {
          icon: Activity,
          title: 'Unknown Risk',
          description: 'Unable to determine risk level',
          variant: 'outline' as const,
        }
    }
  }

  const riskDetails = getRiskDetails()
  const Icon = riskDetails.icon

  return (
    <div className='w-full space-y-6'>
      {/* Main Result Card */}
      <Card className='glass-effect relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/8 to-transparent rounded-bl-full'></div>
        <CardHeader className='relative z-10'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex items-center space-x-4'>
              <div
                className={`glass-effect w-16 h-16 rounded-xl flex items-center justify-center ${riskColor === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' : riskColor === 'rose' ? 'bg-rose-100 dark:bg-rose-900/30' : riskColor === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-primary/10'} relative group`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${riskColor === 'emerald' ? 'from-emerald-500/20 to-emerald-600/20' : riskColor === 'rose' ? 'from-rose-500/20 to-rose-600/20' : riskColor === 'amber' ? 'from-amber-500/20 to-amber-600/20' : 'from-blue-500/20 to-purple-500/20'} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`}
                ></div>
                <Icon
                  className={`h-8 w-8 ${riskColor === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : riskColor === 'rose' ? 'text-rose-600 dark:text-rose-400' : riskColor === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-primary'} relative z-10`}
                />
              </div>
              <div>
                <CardTitle
                  className={`text-xl sm:text-2xl ${riskColor === 'emerald' ? 'text-emerald-700 dark:text-emerald-300' : riskColor === 'rose' ? 'text-rose-700 dark:text-rose-300' : riskColor === 'amber' ? 'text-amber-700 dark:text-amber-300' : 'text-foreground'}`}
                >
                  {riskDetails.title}
                </CardTitle>
                <p
                  className={`text-sm mt-1 ${riskColor === 'emerald' ? 'text-emerald-600 dark:text-emerald-400 font-medium' : riskColor === 'rose' ? 'text-rose-600 dark:text-rose-400' : riskColor === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}
                >
                  {riskDetails.description}
                </p>
              </div>
            </div>

            {/* Risk Score */}
            <div
              className={`glass-effect px-6 py-3 rounded-xl text-center relative group ${riskScoreBgColor} risk-score-${riskScoreColor}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${riskScoreGradient} opacity-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`}
              ></div>
              <div className='relative'>
                <svg className='w-16 h-16 mx-auto transform -rotate-90'>
                  <circle
                    cx='32'
                    cy='32'
                    r='28'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                    className='text-gray-200 dark:text-gray-700'
                  />
                  <circle
                    cx='32'
                    cy='32'
                    r='28'
                    strokeWidth='4'
                    fill='none'
                    strokeLinecap='round'
                    className={`${riskScoreRingColor} transition-all duration-500`}
                    strokeDasharray={`${(riskScore / 100) * 176} 176`}
                  />
                </svg>
                <div
                  className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${riskScoreTextColor}`}
                >
                  {riskScore}
                </div>
              </div>
              <div className='text-sm text-muted-foreground relative z-10 font-medium mt-2'>
                Risk Score
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Address Display */}
          <Card className='glass-effect border-l-4 border-orange-500/50'>
            <CardContent className='p-4'>
              <div className='text-sm mb-1 text-muted-foreground font-medium'>Address</div>
              <div className='font-mono text-base sm:text-lg font-semibold break-all text-orange-600 dark:text-orange-400'>
                {formatAddress(result.address, 8)}
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card
            className={`glass-effect border-l-4 ${riskColor === 'emerald' ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20' : riskColor === 'rose' ? 'border-rose-500/50 bg-rose-50/30 dark:bg-rose-950/20' : riskColor === 'amber' ? 'border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/20' : 'border-slate-500/50'}`}
          >
            <CardContent className='p-4'>
              <div className='font-semibold mb-2'>Recommendation</div>
              <div
                className={`text-sm leading-relaxed ${riskColor === 'emerald' ? 'text-emerald-700 dark:text-emerald-300 font-medium' : riskColor === 'rose' ? 'text-rose-700 dark:text-rose-300' : riskColor === 'amber' ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}
              >
                {result.recommendation}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <Card className='glass-effect hover:shadow-xl transition-all relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full'></div>
          <CardContent className='p-4 relative z-10'>
            <div className='flex items-center space-x-3'>
              <div className='glass-effect w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 relative group'>
                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <Activity className='h-5 w-5 text-primary relative z-10' />
              </div>
              <div>
                <div className='text-sm text-muted-foreground font-medium'>Transactions</div>
                <div className='text-lg font-semibold'>
                  {result.transaction_count?.toLocaleString() || 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='glass-effect hover:shadow-xl transition-all relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-transparent rounded-bl-full'></div>
          <CardContent className='p-4 relative z-10'>
            <div className='flex items-center space-x-3'>
              <div className='glass-effect w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 relative group'>
                <div className='absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <DollarSign className='h-5 w-5 text-primary relative z-10' />
              </div>
              <div>
                <div className='text-sm text-muted-foreground font-medium'>Total Value</div>
                <div className='text-lg font-semibold'>
                  {result.total_value ? formatCurrency(result.total_value) : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='glass-effect hover:shadow-xl transition-all relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-bl-full'></div>
          <CardContent className='p-4 relative z-10'>
            <div className='flex items-center space-x-3'>
              <div className='glass-effect w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 relative group'>
                <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <TrendingUp className='h-5 w-5 text-primary relative z-10' />
              </div>
              <div>
                <div className='text-sm text-muted-foreground font-medium'>Risk Level</div>
                <div className='mt-1'>
                  {riskColor === 'emerald' && (
                    <Badge className='bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800 capitalize text-sm'>
                      {riskLevel}
                    </Badge>
                  )}
                  {riskColor === 'amber' && (
                    <Badge className='bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 capitalize text-sm'>
                      {riskLevel}
                    </Badge>
                  )}
                  {riskColor === 'rose' && (
                    <Badge className='bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800 capitalize text-sm'>
                      {riskLevel}
                    </Badge>
                  )}
                  {riskColor === 'slate' && (
                    <Badge variant='outline' className='capitalize text-sm'>
                      {riskLevel}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Findings Section */}
      {result.findings && result.findings.length > 0 && (
        <Card className='glass-effect'>
          <CardHeader>
            <CardTitle>Analysis Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {result.findings.map((finding, index) => (
                <div
                  key={index}
                  className='flex items-start space-x-3 p-3 glass-effect rounded-lg hover:bg-background/30 transition-colors'
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      riskColor === 'emerald'
                        ? 'bg-emerald-400'
                        : riskColor === 'amber'
                          ? 'bg-amber-400'
                          : riskColor === 'rose'
                            ? 'bg-rose-400'
                            : 'bg-slate-400'
                    }`}
                  />
                  <div className='text-sm text-muted-foreground leading-relaxed'>{finding}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
