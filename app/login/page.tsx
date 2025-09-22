'use client'

import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import {
  LoginSchema,
  RegisterSchema,
  type LoginValues,
  type RegisterValues,
} from '@/lib/validation'
import google from '@/public/images/google.png'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

import Link from 'next/link'


export default function LoginRegister() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loginError, setLoginError] = useState<string | null>(null)
  const [registerError, setRegisterError] = useState<string | null>(null)

  
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.replace('/account')    
    }
  }, [status, session, router])


  const {
    register: loginReg,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLogin,
  } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  })


  const {
    register: regReg,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors, isSubmitting: isRegSubmitting },
    reset: resetRegister,
  } = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
    mode: 'onBlur',
  })

  async function onLogin(values: LoginValues) {
    setLoginError(null);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
  
      if (result?.error) {
    
        const errorMessage =
          result.error === 'CredentialsSignin' ||
          result.error.includes('Configuration')
            ? 'There is a problem with your email or password'
            : 'An unexpected error occurred during login';
        setLoginError(errorMessage);
        return;
      }
  
      resetLogin();
      router.push('/account');
    } catch (error: any) {
      setLoginError('There is a problem with your email or password');
      console.error('Login error:', error);
    }
  }
  async function onRegister(values: RegisterValues) {
    setRegisterError(null);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });
  
      // Read the response body once as text for logging
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response body:', responseText);
  
      // Parse the text as JSON for further processing
      const data = JSON.parse(responseText);
  
      if (!response.ok) {
        setRegisterError(data.error || 'An error occurred during registration');
        return;
      }
  
      const signInResult = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
  
      if (signInResult?.error) {
        setRegisterError('Registration successful, but login failed. Please try logging in.');
        return;
      }
  
      resetRegister();
      router.push('/account');
    } catch (error: any) {
      setRegisterError(error.message || 'An unexpected error occurred');
      console.error('Registration error:', error);
    }
  }

  
  

 
  if (status === 'authenticated') {
    return null
  }

  return (
    <section className="login-register">
       <section className="breadcrumb">
        <ul className="breadcrumb__list flex container">
          <li><Link href="/" className="breadcrumb__link">Home</Link></li>
          <li><span className="breadcrumb__link">{" > "}</span></li>
          <li><span className="breadcrumb__link"><Link href="/account">Login-register</Link></span></li>
        </ul>
      </section>
      <div className="login-register__container container grid">
        {/* Login */}
        <div className="login">
          <h3 className="section__title">Login</h3>

          <form className="form grid" onSubmit={handleLoginSubmit(onLogin)} noValidate>
            {loginError && (
              <p className="form__error" role="alert">{loginError}</p>
            )}

            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Your Email"
              className="form__input"
              aria-invalid={!!loginErrors.email || undefined}
              {...loginReg('email')}
            />
            {loginErrors.email && (
              <p className="form__error" role="alert">{loginErrors.email.message}</p>
            )}

            <input
              type="password"
              autoComplete="current-password"
              placeholder="Your Password"
              className="form__input"
              aria-invalid={!!loginErrors.password || undefined}
              {...loginReg('password')}
            />
            {loginErrors.password && (
              <p className="form__error" role="alert">{loginErrors.password.message}</p>
            )}

            <div className="form_submit signUp__google">
              <div className="form__btn">
                <button type="submit" className="btn" disabled={isLoginSubmitting}>
                  {isLoginSubmitting ? 'Logging in…' : 'Login'}
                </button>
              </div>

              <button
                type="button"
                className="btn google-btn"
                onClick={() => signIn('google')}
              >
                <Image src={google} width={30} height={30} alt="Google icon" loading='lazy'/>
                Login with Google
              </button>
            </div>
          </form>
        </div>

        {/* Register */}
        <div className="register">
          <h3 className="section__title">Create an account</h3>

          <form className="form grid" onSubmit={handleRegisterSubmit(onRegister)} noValidate>
            {registerError && (
              <p className="form__error" role="alert">{registerError}</p>
            )}

            <input
              type="text"
              autoComplete="username"
              placeholder="Username"
              className="form__input"
              aria-invalid={!!regErrors.username || undefined}
              {...regReg('username')}
            />
            {regErrors.username && (
              <p className="form__error" role="alert">{regErrors.username.message}</p>
            )}

            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Your Email"
              className="form__input"
              aria-invalid={!!regErrors.email || undefined}
              {...regReg('email')}
            />
            {regErrors.email && (
              <p className="form__error" role="alert">{regErrors.email.message}</p>
            )}

            <input
              type="password"
              autoComplete="new-password"
              placeholder="Your Password"
              className="form__input"
              aria-invalid={!!regErrors.password || undefined}
              {...regReg('password')}
            />
            {regErrors.password && (
              <p className="form__error" role="alert">{regErrors.password.message}</p>
            )}

            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm Password"
              className="form__input"
              aria-invalid={!!regErrors.confirmPassword || undefined}
              {...regReg('confirmPassword')}
            />
            {regErrors.confirmPassword && (
              <p className="form__error" role="alert">{regErrors.confirmPassword.message}</p>
            )}

            <div className="form_submit signUp__google">
              <div className="form__btn">
                <button className="btn" type="submit" disabled={isRegSubmitting}>
                  {isRegSubmitting ? 'Submitting…' : 'Submit & Register'}
                </button>
              </div>

              <button
                type="button"
                className="btn google-btn"
                onClick={() => signIn('google')}
              >
                <Image src={google} width={30} height={30} alt="Google icon" loading='lazy'/>
                Sign up with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}