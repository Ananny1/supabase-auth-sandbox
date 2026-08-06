import { useState, type FormEvent } from 'react'
import { useAuth } from './useAuth'
import CatMascot from '@/components/CatMascot'
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
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-pink-50 via-orange-50 to-pink-50 p-6 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Card className="w-full max-w-sm border-orange-200 shadow-lg shadow-orange-100 dark:border-neutral-800 dark:shadow-none">
        <CardHeader className="items-center text-center">
          <CatMascot className="mb-2 h-24 w-24" />
          <CardTitle className="text-xl">Purrfectly Sandboxed</CardTitle>
          <CardDescription>Sign up or log in to continue, meow~</CardDescription>
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
              <Button
                type="submit"
                className="flex-1 bg-orange-400 hover:bg-orange-500"
                onClick={handleSignUp}
                disabled={loading}
              >
                Sign Up 🐾
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="flex-1 border-orange-300"
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
