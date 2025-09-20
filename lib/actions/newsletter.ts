'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const NormalizedEmail = z.email("Invalid email").trim().toLowerCase()

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email')

  if (!email || typeof email !== 'string') {
    return { success: false, message: 'Email is required' }
  }

  try {
    const parsed = NormalizedEmail.parse(email)

    await prisma.newsletter.create({
      data: { email: parsed },
    })

    return { success: true, message: '🎉 You have been subscribed!' }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, message: 'You are already subscribed!' }
    }
    return { success: false, message: error.message }
  }
}
