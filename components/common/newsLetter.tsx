'use client'

import { useTransition } from 'react'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '@/lib/actions/newsletter'

const NewsletterSection = () => {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await subscribeToNewsletter(formData)

      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <section className="newsletter section home__newsletter">
      <div className="newsletter__container container grid">
        <h3 className="newsletter__title flex items-center gap-2">
          <Mail size={20} className="icon" />
          Sign up to Newsletter
        </h3>
        <p className="newsletter__description">
          ...and receive $25 coupon for first shopping.
        </p>

        <form action={handleSubmit} className="newsletter__form">
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            className="newsletter__input"
            required
          />
          <button
            type="submit"
            className="newsletter__btn"
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSection
