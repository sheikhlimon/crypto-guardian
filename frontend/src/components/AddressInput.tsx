import { useState, type FormEvent } from 'react'
import LiquidGlass from 'liquid-glass-react'
import { Search, AlertCircle } from 'lucide-react'
import { checkAddress } from '../services/api'
import { validateCryptoAddress, debounce } from '../utils/fp'
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
  const debouncedValidation = debounce((value: string) => {
    if (touched) {
      validateAddress(value)
    }
  }, 300)

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      return `${baseClasses} bg-white/60 border-2 border-red-300/60 text-red-900 backdrop-blur-sm`
    }

    if (address && !error && touched) {
      return `${baseClasses} bg-white/60 border-2 border-green-300/60 text-green-900 backdrop-blur-sm`
    }

    return `${baseClasses} bg-white/60 border-2 border-white/40 text-gray-900 backdrop-blur-sm`
  }

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <LiquidGlass mode='standard' blurAmount={0.0625} className='relative'>
        <form onSubmit={handleSubmit} className='relative'>
          {/* Input container */}
          <div className='relative'>
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
                <Search className='h-5 w-5 text-gray-400' />
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className='mt-2 flex items-center space-x-2 text-red-600 text-sm'>
              <AlertCircle className='h-4 w-4' />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <LiquidGlass
            mode='standard'
            blurAmount={address && !error && !isLoading ? 0.0625 : 0.03125}
            className={`
            w-full mt-4 px-6 py-4 text-lg font-semibold rounded-xl 
            transition-all duration-300 focus:outline-none
            ${address && !error && !isLoading ? 'hover:scale-105' : 'opacity-50'}
          `}
          >
            <button
              type='submit'
              disabled={!address || !!error || isLoading}
              className={`
              w-full bg-transparent border-0 font-bold focus:outline-none
              ${
                address && !error && !isLoading
                  ? 'gradient-text'
                  : 'text-gray-400 cursor-not-allowed'
              }
            `}
            >
              {isLoading ? 'Checking Address...' : 'Check Wallet Safety'}
            </button>
          </LiquidGlass>
        </form>
      </LiquidGlass>

      {/* Help text */}
      <LiquidGlass
        mode='standard'
        blurAmount={0.03125}
        className='mt-6 text-center text-sm text-gray-500 p-4 rounded-lg'
      >
        <p>Supports Ethereum (0x...), Bitcoin (1..., bc1...), and other major blockchains</p>
      </LiquidGlass>
    </div>
  )
}
