import { useState, type FormEvent } from 'react'
import { Search, AlertCircle, Shield } from 'lucide-react'
import { checkAddress } from '../services/api'
import { validateCryptoAddress, debounce } from '../utils/fp'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import type { AddressCheckResponse } from '../types/api'

interface AddressInputProps {
  onCheck: (result: AddressCheckResponse) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  setAnalysisComplete: (complete: boolean) => void
}

export default function AddressInput({
  onCheck,
  isLoading,
  setIsLoading,
  setAnalysisComplete,
}: AddressInputProps) {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)
  const [isWakingUp, setIsWakingUp] = useState(false)

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

  const debouncedValidation = debounce((value: unknown) => {
    if (touched && typeof value === 'string') {
      validateAddress(value)
    }
  }, 300)

  const handleInputChange = (e: { target: { value: string } }) => {
    const value = e.target.value
    setAddress(value)
    debouncedValidation(value)
  }

  const handleBlur = () => {
    setTouched(true)
    validateAddress(address)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateAddress(address) || isLoading) {
      return
    }

    setIsLoading(true)
    setError('')
    setIsWakingUp(false)

    const wakeUpTimer = setTimeout(() => setIsWakingUp(true), 3000)

    try {
      const result = await checkAddress(address)

      if (result.success && result.data) {
        onCheck(result.data)
        setAnalysisComplete(true)
      } else {
        setError(result.error || 'Failed to check address')
        setAnalysisComplete(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setAnalysisComplete(false)
    } finally {
      clearTimeout(wakeUpTimer)
      setIsLoading(false)
      setIsWakingUp(false)
    }
  }

  return (
    <div className='w-full'>
      <Card>
        <CardContent className='p-5'>
          <form onSubmit={handleSubmit}>
            {/* Input */}
            <div className='relative mb-3'>
              <Input
                type='text'
                id='crypto-address'
                name='crypto-address'
                value={address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder='Enter crypto address (0x..., 1..., bc1...)'
                className={`font-mono text-sm h-12 pr-10 ${
                  error
                    ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20'
                    : address && !error && touched
                      ? 'border-primary focus-visible:border-primary focus-visible:ring-primary/20'
                      : ''
                }`}
                disabled={isLoading}
                autoComplete='off'
                spellCheck={false}
              />
              <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                {isLoading ? (
                  <div className='animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full' />
                ) : (
                  <Search className='h-4 w-4 text-muted-foreground' />
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className='mb-3 flex items-start gap-2 text-sm text-destructive bg-destructive/5 rounded-md px-3 py-2.5'>
                <AlertCircle className='h-4 w-4 mt-0.5 flex-shrink-0' />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type='submit'
              disabled={!address || !!error || isLoading}
              className='w-full h-11 text-sm font-medium'
            >
              {isLoading ? (
                <>
                  <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                  <span>
                    {isWakingUp
                      ? 'Waking up server, this can take up to 50s...'
                      : 'Checking Address...'}
                  </span>
                </>
              ) : (
                <>
                  <Shield className='w-4 h-4' />
                  <span>Check Wallet Safety</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help text */}
      <p className='mt-3 text-center text-xs text-muted-foreground font-mono'>
        Supports Ethereum (0x...) · Bitcoin (1..., bc1...) · Other major blockchains
      </p>
    </div>
  )
}
