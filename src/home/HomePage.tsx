import { useAuth } from '@/auth/useAuth'
import CatMascot from '@/components/CatMascot'
import { SleepingCat, PawPrint } from '@/components/CatDecor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function HomePage() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-pink-50 via-orange-50 to-pink-50 p-6 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <Card className="w-full max-w-sm border-orange-200 text-center shadow-lg shadow-orange-100 dark:border-neutral-800 dark:shadow-none">
        <CardHeader className="items-center">
          <CatMascot className="mb-2 h-24 w-24" />
          <CardTitle className="text-xl">Welcome back, friend!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm break-all text-muted-foreground">{user?.email}</p>

          <div className="flex items-center justify-center gap-2 text-orange-400 dark:text-orange-300">
            <PawPrint className="h-5 w-5" />
            <PawPrint className="h-5 w-5 opacity-70" />
            <PawPrint className="h-5 w-5 opacity-40" />
          </div>

          <p className="text-sm text-muted-foreground">
            Fun fact: cats spend about 70% of their life sleeping, which
            works out to somewhere between 12 and 16 hours a day. Basically
            professional nappers.
          </p>

          <SleepingCat className="h-16 w-28" />

          <Button
            variant="outline"
            className="border-orange-300"
            onClick={() => signOut()}
          >
            Log Out 🐾
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage
