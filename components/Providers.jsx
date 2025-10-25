'use client'
import { SessionProvider } from 'next-auth/react'
import { AppContextProvider } from '@/context/AppContext'

export default function Providers({ children }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </SessionProvider>
  )
}