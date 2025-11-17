import { useState, type FormEvent } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { checkAddress } from '../services/api'
import { validateCryptoAddress, debounce } from '../utils/fp'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Alert, AlertDescription } from './ui/alert'
import { Card, CardContent } from './ui/card'
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

  return (
    <div className='w-full'>
      <Card className='glass-effect relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full'></div>
        <CardContent className='p-6 relative z-10'>
          <form onSubmit={handleSubmit}>
            {/* Input container */}
            <div className='relative mb-4'>
              <Input
                type='text'
                id='crypto-address'
                name='crypto-address'
                value={address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder='Enter crypto address (0x..., 1..., bc1...)'
                className={`text-base h-12 pr-12 transition-all ${
                  error
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : address && !error && touched
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                      : 'focus:ring-primary/20'
                }`}
                disabled={isLoading}
                autoComplete='off'
                spellCheck={false}
              />

              {/* Search icon */}
              <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                {isLoading ? (
                  <div className='relative'>
                    <div className='animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full'></div>
                    <div
                      className='absolute inset-0 h-5 w-5 border-2 border-primary/20 border-t-transparent rounded-full animate-spin'
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                  </div>
                ) : (
                  <Search className='h-5 w-5 text-muted-foreground' />
                )}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className='mb-4 space-y-2'>
                <div className='flex items-center justify-center'>
                  <div className='inline-flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg glass-effect relative overflow-hidden group'>
                    <div className='absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
                    <AlertCircle className='h-4 w-4 text-red-400 relative z-10' />
                    <span className='text-sm font-medium text-red-400 relative z-10'>
                      Analysis Failed
                    </span>
                  </div>
                </div>
                <Alert variant='destructive' className='relative overflow-hidden'>
                  <div className='absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-500 to-red-600'></div>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Submit button */}
            <Button
              type='submit'
              disabled={!address || !!error || isLoading}
              className='w-full h-12 text-base font-semibold transition-all hover:shadow-lg relative overflow-hidden group'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transform translate-x-full group-hover:translate-x-0 transition-transform'></div>
              <span className='relative z-10'>
                {isLoading ? 'Checking Address...' : 'Check Wallet Safety'}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help text */}
      <div className='mt-4 text-center'>
        <Card className='glass-effect inline-block relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50'></div>
          <CardContent className='px-6 py-3 relative z-10'>
            <div className='flex items-center space-x-2'>
              <div className='w-1.5 h-1.5 bg-primary rounded-full'></div>
              <p className='text-sm text-muted-foreground'>
                Supports Ethereum (0x...), Bitcoin (1..., bc1...), and other major blockchains
              </p>
              <div className='w-1.5 h-1.5 bg-primary rounded-full'></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
