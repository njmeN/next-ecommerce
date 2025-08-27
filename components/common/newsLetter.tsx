// components/layout/NewsletterSection.tsx
'use client'

import { Mail } from 'lucide-react'

const NewsletterSection = () => {
  return (
    <section className="newsletter section home__newsletter">
      <div className="newsletter__container container grid">
        <h3 className="newsletter__title flex items-center gap-2">
          <Mail size={20} className='icon' />
          Sign up to Newsletter
        </h3>
        <p className="newsletter__description">...and receive $25 coupon for first shopping.</p>

        <form className="newsletter__form">
          <input
            type="email"
            placeholder="Enter your Email"
            className="newsletter__input"
            disabled
          />
          <button type="submit" className="newsletter__btn">Subscribe</button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSection
