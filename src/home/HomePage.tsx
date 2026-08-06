import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function HomePage() {
  const { user, signOut } = useAuth()
  const initial = (user?.email ?? '?').charAt(0).toUpperCase()

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {initial}
          </div>
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm break-all text-muted-foreground">{user?.email}</p>
          <Button variant="outline" onClick={() => signOut()}>
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage
