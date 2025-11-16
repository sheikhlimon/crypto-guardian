import { useState, type FormEvent } from 'react'
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
      return `${baseClasses} bg-white/60 border-2 border-red-300/60 text-red-900 backdrop-blur-sm focus:border-red-500 focus:ring-2 focus:ring-red-200`
    }

    if (address && !error && touched) {
      return `${baseClasses} bg-white/60 border-2 border-green-300/60 text-green-900 backdrop-blur-sm focus:border-green-500 focus:ring-2 focus:ring-green-200`
    }

    return `${baseClasses} bg-white/60 border-2 border-white/40 text-gray-900 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200`
  }

  return (
    <div className='w-full'>
      <div className='bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm'>
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
                <Search className='h-5 w-5 text-gray-400' />
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className='mb-4 flex items-center space-x-2 text-red-600 text-sm'>
              <AlertCircle className='h-4 w-4 flex-shrink-0' />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type='submit'
            disabled={!address || !!error || isLoading}
            className={`
            w-full px-6 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white
            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${address && !error && !isLoading ? 'hover:shadow-lg hover:scale-[1.02]' : 'opacity-50 cursor-not-allowed'}
          `}
          >
            {isLoading ? 'Checking Address...' : 'Check Wallet Safety'}
          </button>
        </form>
      </div>

      {/* Help text */}
      <div className='mt-4 text-center'>
        <div className='inline-block text-sm text-gray-500 px-4 py-2 bg-gray-100 rounded-lg'>
          <p>Supports Ethereum (0x...), Bitcoin (1..., bc1...), and other major blockchains</p>
        </div>
      </div>
    </div>
  )
}
