import { Shield, AlertTriangle, XCircle, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { formatCurrency, formatAddress, getRiskColor, getRiskScoreRingColor } from '../utils/fp'
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
  const riskScoreRingColor = getRiskScoreRingColor(riskScore)

  const getRiskDetails = () => {
    switch (riskLevel) {
      case 'clean':
      case 'safe':
        return {
          icon: Shield,
          title: 'Safe Address',
          description: 'This address appears to be safe for transactions',
        }
      case 'suspicious':
        return {
          icon: AlertTriangle,
          title: 'Suspicious Activity',
          description: 'Exercise caution with this address',
        }
      case 'malicious':
        return {
          icon: XCircle,
          title: 'High Risk Address',
          description: 'Avoid transactions with this address',
        }
      default:
        return {
          icon: Activity,
          title: 'Unknown Risk',
          description: 'Unable to determine risk level',
        }
    }
  }

  const riskDetails = getRiskDetails()
  const Icon = riskDetails.icon

  const colorMap: Record<string, { text: string; bg: string; border: string; dot: string }> = {
    emerald: {
      text: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    amber: {
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    rose: {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
    slate: {
      text: 'text-foreground',
      bg: 'bg-secondary',
      border: 'border-border',
      dot: 'bg-muted-foreground',
    },
  }

  const colors = colorMap[riskColor] || colorMap.slate

  return (
    <div className='w-full space-y-4'>
      {/* Main Result */}
      <Card>
        <CardHeader>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex items-center space-x-3'>
              <div className={`w-12 h-12 rounded-md ${colors.bg} flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${colors.text}`} />
              </div>
              <div>
                <CardTitle className={`text-lg ${colors.text}`}>{riskDetails.title}</CardTitle>
                <p className='text-sm text-muted-foreground mt-0.5'>{riskDetails.description}</p>
              </div>
            </div>

            {/* Risk Score Ring */}
            <div className='text-center'>
              <div className='w-16 h-16 mx-auto relative'>
                <svg className='w-full h-full' viewBox='0 0 64 64'>
                  <g transform='rotate(-90 32 32)'>
                    <circle
                      cx='32'
                      cy='32'
                      r='28'
                      stroke='currentColor'
                      strokeWidth='3'
                      fill='none'
                      className='text-border'
                    />
                    <circle
                      cx='32'
                      cy='32'
                      r='28'
                      strokeWidth='3'
                      fill='none'
                      strokeLinecap='round'
                      className={`${riskScoreRingColor} transition-all duration-500`}
                      strokeDasharray={`${(riskScore / 100) * 176} 176`}
                    />
                  </g>
                  <text
                    x='32'
                    y='32'
                    textAnchor='middle'
                    dominantBaseline='middle'
                    fontSize='20'
                    fontWeight='600'
                    fontFamily='"DM Sans", system-ui, sans-serif'
                    fill='currentColor'
                    className={colors.text}
                  >
                    {riskScore}
                  </text>
                </svg>
              </div>
              <div className='text-xs text-muted-foreground font-medium mt-1'>Risk Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          {/* Address */}
          <div className={`rounded-md border-l-[3px] ${colors.border} ${colors.bg} px-4 py-3`}>
            <div className='text-xs text-muted-foreground font-medium mb-1'>Address</div>
            <div className='font-mono text-sm font-medium break-all'>
              {formatAddress(result.address, 8)}
            </div>
          </div>

          {/* Recommendation */}
          {result.recommendation && (
            <div className={`rounded-md border-l-[3px] ${colors.border} ${colors.bg} px-4 py-3`}>
              <div className='text-xs font-medium mb-1'>Recommendation</div>
              <div className={`text-sm leading-relaxed ${colors.text}`}>
                {result.recommendation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center'>
                <Activity className='h-4 w-4 text-primary' />
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>Transactions</div>
                <div className='text-sm font-semibold'>
                  {result.transaction_count?.toLocaleString() || 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center'>
                <DollarSign className='h-4 w-4 text-primary' />
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>Total Value</div>
                <div className='text-sm font-semibold'>
                  {result.total_value ? formatCurrency(result.total_value) : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center'>
                <TrendingUp className='h-4 w-4 text-primary' />
              </div>
              <div>
                <div className='text-xs text-muted-foreground'>Risk Level</div>
                <div className='mt-0.5'>
                  <Badge
                    className={`${colors.bg} ${colors.text} ${colors.border} capitalize text-xs`}
                  >
                    {riskLevel}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Findings */}
      {result.findings && result.findings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Analysis Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {result.findings.map((finding, index) => (
                <div key={index} className='flex items-start gap-2.5 text-sm text-muted-foreground'>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${colors.dot}`} />
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
