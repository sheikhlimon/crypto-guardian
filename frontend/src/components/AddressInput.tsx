import { useState, type FormEvent } from 'react'
import { Search, AlertCircle, Shield } from 'lucide-react'
import { validateCryptoAddress, debounce } from '../utils/fp'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import type { LoadingStatus } from '../App'

interface AddressInputProps {
  onSubmit: (address: string) => void
  isLoading: boolean
  loadingStatus: LoadingStatus
}

const statusMessages: Record<LoadingStatus, string> = {
  idle: '',
  connecting: 'Analyzing address...',
  waking_up: 'Server is waking from sleep...',
  analyzing: 'Connected, analyzing address...',
}

const buttonLabels: Record<LoadingStatus, string> = {
  idle: 'Check Wallet Safety',
  connecting: 'Analyzing...',
  waking_up: 'Waking server...',
  analyzing: 'Analyzing...',
}

export default function AddressInput({ onSubmit, isLoading, loadingStatus }: AddressInputProps) {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

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

    onSubmit(address)
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
              {!isLoading && (
                <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                  <Search className='h-4 w-4 text-muted-foreground' />
                </div>
              )}
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
                  <span>{buttonLabels[loadingStatus]}</span>
                </>
              ) : (
                <>
                  <Shield className='w-4 h-4' />
                  <span>Check Wallet Safety</span>
                </>
              )}
            </Button>
          </form>

          {/* Status bar */}
          {isLoading && loadingStatus !== 'idle' && (
            <div className='mt-3 flex items-center gap-2 text-xs text-muted-foreground font-mono'>
              <div className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
              <span>{statusMessages[loadingStatus]}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help text */}
      <p className='mt-3 text-center text-xs text-muted-foreground font-mono'>
        Supports Ethereum (0x...) · Bitcoin (1..., bc1...) · Other major blockchains
      </p>
    </div>
  )
}
