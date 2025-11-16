import { Shield, AlertTriangle, XCircle, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { formatCurrency, formatAddress, getRiskColor } from '../utils/fp'
import type { AddressCheckResponse } from '../types/api'

interface ResultCardProps {
  result: AddressCheckResponse
}

export default function ResultCard({ result }: ResultCardProps) {
  const riskLevel = result.verdict.toLowerCase()
  const riskColor = getRiskColor(result.verdict)
  const riskScore = result.risk_score

  // Get risk level details
  const getRiskDetails = () => {
    switch (riskLevel) {
      case 'clean':
      case 'safe':
        return {
          icon: Shield,
          title: 'Safe Address',
          description: 'This address appears to be safe for transactions',
          bgClass: 'risk-safe',
          borderColor: 'border-green-300',
          textColor: 'text-green-900',
        }
      case 'suspicious':
        return {
          icon: AlertTriangle,
          title: 'Suspicious Activity',
          description: 'Exercise caution with this address',
          bgClass: 'risk-suspicious',
          borderColor: 'border-amber-300',
          textColor: 'text-amber-900',
        }
      case 'malicious':
        return {
          icon: XCircle,
          title: 'High Risk Address',
          description: 'Avoid transactions with this address',
          bgClass: 'risk-malicious',
          borderColor: 'border-red-300',
          textColor: 'text-red-900',
        }
      default:
        return {
          icon: Activity,
          title: 'Unknown Risk',
          description: 'Unable to determine risk level',
          bgClass: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-900',
        }
    }
  }

  const riskDetails = getRiskDetails()
  const Icon = riskDetails.icon

  return (
    <div className='w-full space-y-6'>
      {/* Main Result Card */}
      <div
        className={`
        bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-sm
        ${riskDetails.borderColor}
      `}
      >
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4'>
          <div className='flex items-center space-x-4'>
            <div
              className={`
              p-3 rounded-xl
              ${riskColor === 'green' ? 'bg-green-100 text-green-600' : ''}
              ${riskColor === 'yellow' ? 'bg-amber-100 text-amber-600' : ''}
              ${riskColor === 'red' ? 'bg-red-100 text-red-600' : ''}
              ${riskColor === 'gray' ? 'bg-gray-100 text-gray-600' : ''}
            `}
            >
              <Icon className='h-8 w-8' />
            </div>
            <div>
              <h2 className='text-xl sm:text-2xl font-bold text-gray-900'>{riskDetails.title}</h2>
              <p className='text-sm text-gray-600 mt-1'>{riskDetails.description}</p>
            </div>
          </div>

          {/* Risk Score */}
          <div className='text-center'>
            <div className='text-3xl sm:text-4xl font-bold text-gray-900'>{riskScore}</div>
            <div className='text-sm text-gray-600'>Risk Score</div>
          </div>
        </div>

        {/* Address Display */}
        <div className='mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200/50'>
          <div className='text-sm text-gray-600 mb-1'>Address</div>
          <div className='font-mono text-base sm:text-lg font-semibold text-gray-900 break-all'>
            {formatAddress(result.address, 8)}
          </div>
        </div>

        {/* Recommendation */}
        <div className='mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200/50'>
          <div className='font-semibold text-gray-900 mb-2'>Recommendation</div>
          <div className='text-sm text-gray-700'>{result.recommendation}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center'>
              <Activity className='h-5 w-5 text-blue-600' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Transactions</div>
              <div className='text-lg font-semibold text-gray-900'>
                {result.transaction_count?.toLocaleString() || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center'>
              <DollarSign className='h-5 w-5 text-green-600' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Total Value</div>
              <div className='text-lg font-semibold text-gray-900'>
                {result.total_value ? formatCurrency(result.total_value) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 shadow-sm'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center'>
              <TrendingUp className='h-5 w-5 text-purple-600' />
            </div>
            <div>
              <div className='text-sm text-gray-600'>Risk Level</div>
              <div
                className={`text-lg font-semibold capitalize ${
                  riskColor === 'green'
                    ? 'text-green-600'
                    : riskColor === 'yellow'
                      ? 'text-amber-600'
                      : riskColor === 'red'
                        ? 'text-red-600'
                        : 'text-gray-600'
                }`}
              >
                {riskLevel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Findings Section */}
      {result.findings && result.findings.length > 0 && (
        <div className='bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Analysis Findings</h3>
          <div className='space-y-3'>
            {result.findings.map((finding, index) => (
              <div key={index} className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'>
                <div
                  className={`
                  w-2 h-2 rounded-full mt-2 flex-shrink-0
                  ${
                    riskColor === 'green'
                      ? 'bg-green-500'
                      : riskColor === 'yellow'
                        ? 'bg-amber-500'
                        : riskColor === 'red'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                  }
                `}
                />
                <div className='text-sm text-gray-700'>{finding}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
