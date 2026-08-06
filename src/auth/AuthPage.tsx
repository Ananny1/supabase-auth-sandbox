import { useState, type FormEvent } from 'react'
import { useAuth } from './useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function AuthPage() {
  const { signUp, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const fieldsAreValid = () => {
    if (!email || !password) {
      setIsError(true)
      setMessage('Email and password are required.')
      return false
    }
    return true
  }

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()
    if (!fieldsAreValid()) return
    setLoading(true)
    setMessage(null)
    const { error } = await signUp(email, password)
    setLoading(false)
    if (error) {
      setIsError(true)
      setMessage(error)
    } else {
      setIsError(false)
      setMessage('Signed up! Check your email if confirmation is required.')
    }
  }

  const handleLogIn = async (e: FormEvent) => {
    e.preventDefault()
    if (!fieldsAreValid()) return
    setLoading(true)
    setMessage(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setIsError(true)
      setMessage(error)
    }
    // On success, AuthProvider's session update switches App to HomePage.
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sandbox Auth</CardTitle>
          <CardDescription>Sign up or log in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" onClick={handleSignUp} disabled={loading}>
                Sign Up
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="flex-1"
                onClick={handleLogIn}
                disabled={loading}
              >
                Log In
              </Button>
            </div>
          </form>
        </CardContent>
        {message && (
          <CardFooter>
            <p
              className={`w-full rounded-md px-3 py-2 text-sm ${
                isError
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-green-500/10 text-green-600 dark:text-green-400'
              }`}
            >
              {message}
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default AuthPage
