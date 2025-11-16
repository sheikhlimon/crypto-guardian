import { useState, type FormEvent } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { checkAddress } from '../services/api'
import { validateCryptoAddress, debounce } from '../utils/fp'
import { useTheme } from '../contexts/ThemeContext'
import type { AddressCheckResponse } from '../types/api'

interface AddressInputProps {
  onCheck: (result: AddressCheckResponse) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export default function AddressInput({ onCheck, isLoading, setIsLoading }: AddressInputProps) {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)
  const { isDarkMode } = useTheme()

  // Validate address
  const validateAddress = (value: string) => {
    if (!value) {
      setError('Address is required')
      return false
    }

    if (!validateCryptoAddress(value)) {
      setError('Please enter a valid crypto address')
      return false
    }

    setError('')
    return true
  }

  // Debounced validation
  const debouncedValidation = debounce((value: unknown) => {
    if (touched && typeof value === 'string') {
      validateAddress(value)
    }
  }, 300)

  // Handle input change
  const handleInputChange = (e: { target: { value: string } }) => {
    const value = e.target.value
    setAddress(value)
    debouncedValidation(value)
  }

  // Handle input blur
  const handleBlur = () => {
    setTouched(true)
    validateAddress(address)
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateAddress(address) || isLoading) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await checkAddress(address)

      if (result.success && result.data) {
        onCheck(result.data)
      } else {
        setError(result.error || 'Failed to check address')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Determine input state classes
  const getInputClasses = () => {
    const baseClasses =
      'w-full px-4 py-4 text-lg rounded-xl transition-all duration-200 focus:outline-none'

    if (error) {
      return `${baseClasses} glass-input border-2 border-red-400 ${isDarkMode ? 'text-red-200' : 'text-red-900'} focus:border-red-500 focus:ring-2 focus:ring-red-200`
    }

    if (address && !error && touched) {
      return `${baseClasses} glass-input border-2 border-green-400 ${isDarkMode ? 'text-green-200' : 'text-green-900'} focus:border-green-500 focus:ring-2 focus:ring-green-200`
    }

    return `${baseClasses} glass-input border-2 ${isDarkMode ? 'text-white border-white/40' : 'text-gray-900 border-white/40'} ${isDarkMode ? 'focus:border-blue-400' : 'focus:border-blue-500'} focus:ring-2 focus:ring-blue-200`
  }

  return (
    <div className='w-full'>
      <div className={`glass-card rounded-xl p-6 ${isDarkMode ? 'border-white/10' : ''}`}>
        <form onSubmit={handleSubmit}>
          {/* Input container */}
          <div className='relative mb-4'>
            <input
              type='text'
              value={address}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder='Enter crypto address (0x..., 1..., bc1...)'
              className={getInputClasses()}
              disabled={isLoading}
              autoComplete='off'
              spellCheck={false}
            />

            {/* Search icon */}
            <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
              {isLoading ? (
                <div className='animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full' />
              ) : (
                <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className={`mb-4 flex items-center space-x-2 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
            >
              <AlertCircle className='h-4 w-4 flex-shrink-0' />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type='submit'
            disabled={!address || !!error || isLoading}
            className={`
            glass-button w-full px-6 py-3 text-lg font-semibold rounded-xl
            ${
              address && !error && !isLoading
                ? `${isDarkMode ? 'text-white' : 'text-gray-900'} hover:shadow-lg`
                : 'opacity-50 cursor-not-allowed'
            }
          `}
          >
            {isLoading ? 'Checking Address...' : 'Check Wallet Safety'}
          </button>
        </form>
      </div>

      {/* Help text */}
      <div className='mt-4 text-center'>
        <div
          className={`inline-block text-sm px-4 py-2 glass-morphism-dark rounded-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}
        >
          <p>Supports Ethereum (0x...), Bitcoin (1..., bc1...), and other major blockchains</p>
        </div>
      </div>
    </div>
  )
}
