import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogIn, UserPlus, AlertTriangle } from 'lucide-react'

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (mode === 'login') {
      const ok = login(email, password)
      if (ok) navigate('/app')
      else setError('Invalid email or password. Try demo@web-library.net / demo123')
    } else {
      if (!name.trim()) { setError('Name is required'); return }
      const ok = register(email, password, name)
      if (ok) navigate('/app')
      else setError('Email already registered')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
            D
          </div>
          <h1 className="text-2xl font-bold text-gray-900">DomainIQ</h1>
          <p className="text-sm text-gray-500 mt-1">Expired Domain Intelligence</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(v) => { setMode(v as any); setError('') }}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertTriangle size={16} />
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-black">
                  {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {mode === 'login' ? 'Login' : 'Register'}
                </Button>
              </form>
            </Tabs>

            <div className="mt-4 text-center text-xs text-gray-400">
              Demo: <code className="bg-gray-100 px-1.5 py-0.5 rounded">demo@web-library.net</code> / <code className="bg-gray-100 px-1.5 py-0.5 rounded">demo123</code>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/" className="text-amber-600 hover:text-amber-700 font-medium">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
