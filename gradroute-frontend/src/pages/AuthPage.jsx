import { useState } from 'react'
import AuthLayout from '../components/auth/AuthLayout'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <AuthLayout>
      {isLogin ? (
        <LoginForm onToggle={() => setIsLogin(false)} />
      ) : (
        <SignupForm onToggle={() => setIsLogin(true)} />
      )}
    </AuthLayout>
  )
}

export default AuthPage