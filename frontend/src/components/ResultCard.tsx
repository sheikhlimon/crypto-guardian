import { Shield, AlertTriangle, XCircle, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { formatCurrency, formatAddress, getRiskColor } from '../utils/fp'
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

  const getRiskBadgeVariant = () => {
    switch (riskColor) {
      case 'green':
        return 'default' as const
      case 'yellow':
        return 'secondary' as const
      case 'red':
        return 'destructive' as const
      default:
        return 'outline' as const
    }
  }

  return (
    <div className='w-full space-y-6'>
      {/* Success Notification */}
      <div className='flex items-center justify-center mb-4'>
        <div className='inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg glass-effect relative overflow-hidden group'>
          <div className='absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
          <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse relative z-10'></div>
          <span className='text-sm font-medium text-green-400 relative z-10'>
            Analysis Complete
          </span>
          <div
            className='w-2 h-2 bg-green-400 rounded-full animate-pulse relative z-10'
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>
      </div>

      {/* Main Result Card */}
      <Card className='glass-effect relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/8 to-transparent rounded-bl-full'></div>
        <CardHeader className='relative z-10'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex items-center space-x-4'>
              <div className='glass-effect w-16 h-16 rounded-xl flex items-center justify-center bg-primary/10 relative group'>
                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <Icon className='h-8 w-8 text-primary relative z-10' />
              </div>
              <div>
                <CardTitle className='text-xl sm:text-2xl'>{riskDetails.title}</CardTitle>
                <p className='text-sm mt-1 text-muted-foreground'>{riskDetails.description}</p>
              </div>
            </div>

            {/* Risk Score */}
            <div className='glass-effect px-6 py-3 rounded-xl text-center relative group'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity'></div>
              <div className='text-3xl sm:text-4xl font-bold relative z-10'>{riskScore}</div>
              <div className='text-sm text-muted-foreground relative z-10'>Risk Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Address Display */}
          <Card className='glass-effect'>
            <CardContent className='p-4'>
              <div className='text-sm mb-1 text-muted-foreground font-medium'>Address</div>
              <div className='font-mono text-base sm:text-lg font-semibold break-all'>
                {formatAddress(result.address, 8)}
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className='glass-effect'>
            <CardContent className='p-4'>
              <div className='font-semibold mb-2'>Recommendation</div>
              <div className='text-sm text-muted-foreground leading-relaxed'>
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
                <Badge variant={getRiskBadgeVariant()} className='capitalize text-sm mt-1'>
                  {riskLevel}
                </Badge>
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
                      riskColor === 'green'
                        ? 'bg-green-400'
                        : riskColor === 'yellow'
                          ? 'bg-amber-400'
                          : riskColor === 'red'
                            ? 'bg-red-400'
                            : 'bg-gray-400'
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
