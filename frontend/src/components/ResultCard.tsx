import { Shield, AlertTriangle, XCircle, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { formatCurrency, formatAddress, getRiskColor } from '../utils/fp'
import { useTheme } from '../contexts/ThemeContext'
import type { AddressCheckResponse } from '../types/api'

interface ResultCardProps {
  result: AddressCheckResponse
}

export default function ResultCard({ result }: ResultCardProps) {
  const { isDarkMode } = useTheme()
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
        ${riskDetails.bgClass} rounded-2xl p-6 border-2
        ${riskDetails.borderColor}
      `}
      >
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4'>
          <div className='flex items-center space-x-4'>
            <div
              className={`
              glass-morphism-dark p-3 rounded-xl
              ${riskColor === 'green' ? 'text-green-400' : ''}
              ${riskColor === 'yellow' ? 'text-amber-400' : ''}
              ${riskColor === 'red' ? 'text-red-400' : ''}
              ${riskColor === 'gray' ? 'text-gray-400' : ''}
            `}
            >
              <Icon className='h-8 w-8' />
            </div>
            <div>
              <h2
                className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {riskDetails.title}
              </h2>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {riskDetails.description}
              </p>
            </div>
          </div>

          {/* Risk Score */}
          <div className='text-center'>
            <div
              className={`text-3xl sm:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {riskScore}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Risk Score
            </div>
          </div>
        </div>

        {/* Address Display */}
        <div
          className={`glass-morphism-dark mt-4 p-4 rounded-lg ${isDarkMode ? '' : 'bg-white/10'}`}
        >
          <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-white/80'}`}>
            Address
          </div>
          <div
            className={`font-mono text-base sm:text-lg font-semibold break-all ${isDarkMode ? 'text-gray-100' : 'text-white'}`}
          >
            {formatAddress(result.address, 8)}
          </div>
        </div>

        {/* Recommendation */}
        <div
          className={`glass-morphism-dark mt-4 p-4 rounded-lg ${isDarkMode ? '' : 'bg-white/10'}`}
        >
          <div className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-white'}`}>
            Recommendation
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-white/90'}`}>
            {result.recommendation}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='glass-card p-4 rounded-xl'>
          <div className='flex items-center space-x-3'>
            <div
              className={`glass-morphism-dark w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-slate-600/30' : ''}`}
            >
              <Activity className={`h-5 w-5 ${isDarkMode ? 'text-gray-200' : 'text-white'}`} />
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Transactions
              </div>
              <div
                className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {result.transaction_count?.toLocaleString() || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className='glass-card p-4 rounded-xl'>
          <div className='flex items-center space-x-3'>
            <div
              className={`glass-morphism-dark w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-slate-600/30' : ''}`}
            >
              <DollarSign className={`h-5 w-5 ${isDarkMode ? 'text-gray-200' : 'text-white'}`} />
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Value
              </div>
              <div
                className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {result.total_value ? formatCurrency(result.total_value) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className='glass-card p-4 rounded-xl'>
          <div className='flex items-center space-x-3'>
            <div
              className={`glass-morphism-dark w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-slate-600/30' : ''}`}
            >
              <TrendingUp className={`h-5 w-5 ${isDarkMode ? 'text-gray-200' : 'text-white'}`} />
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Risk Level
              </div>
              <div
                className={`text-lg font-semibold capitalize ${
                  riskColor === 'green'
                    ? isDarkMode
                      ? 'text-green-400'
                      : 'text-green-600'
                    : riskColor === 'yellow'
                      ? isDarkMode
                        ? 'text-amber-400'
                        : 'text-amber-600'
                      : riskColor === 'red'
                        ? isDarkMode
                          ? 'text-red-400'
                          : 'text-red-600'
                        : isDarkMode
                          ? 'text-gray-400'
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
        <div className='glass-card rounded-xl p-4'>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Analysis Findings
          </h3>
          <div className='space-y-3'>
            {result.findings.map((finding, index) => (
              <div
                key={index}
                className='flex items-start space-x-3 p-3 glass-morphism-dark rounded-lg'
              >
                <div
                  className={`
                  w-2 h-2 rounded-full mt-2 flex-shrink-0
                  ${
                    riskColor === 'green'
                      ? 'bg-green-400'
                      : riskColor === 'yellow'
                        ? 'bg-amber-400'
                        : riskColor === 'red'
                          ? 'bg-red-400'
                          : 'bg-gray-400'
                  }
                `}
                />
                <div className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-white/80'}`}>
                  {finding}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
