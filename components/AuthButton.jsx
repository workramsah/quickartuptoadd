'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { assets } from '@/assets/assets'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <button className='flex items-center gap-2 text-gray-500 cursor-default' disabled>
        <Image src={assets.user_icon} alt='user icon' />
        Loading...
      </button>
    )
  }

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className='flex items-center gap-2 hover:text-gray-900 transition'
      >
        <Image src={assets.user_icon} alt='user icon' />
        Logout
      </button>
    )
  }

  return (
    <button
      onClick={() => signIn('google')}
      className='flex items-center gap-2 hover:text-gray-900 transition'
    >
      <Image src={assets.user_icon} alt='user icon' />
      Login
    </button>
  )
}