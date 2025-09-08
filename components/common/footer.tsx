import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/images/logo.svg'
import paymentMethodImg from '@/public/images/payment-method.png'
import facebookIcon from '@/public/images/icon-facebook.svg'
import twitterIcon from '@/public/images/icon-twitter.svg'
import instagramIcon from '@/public/images/icon-instagram.svg'
import pinterestIcon from '@/public/images/icon-pinterest.svg'
import youtubeIcon from '@/public/images/icon-youtube.svg'


const Footer = () => {
  return (
    <footer className="footer container">
      <div className="footer__container grid">
        <div className="footer__content">
          <Link href="/" className="footer__logo">
            <Image src={logo} alt="Logo" className="footer__logo-img" />
          </Link>

          <h4 className="footer__subtitle">Contact</h4>
          <p className="footer__description"><span>Address:</span> 562 Wellington Road, Street 32, San Francisco</p>
          <p className="footer__description"><span>Phone:</span> +01 2222 365 /(+91) 01 2345 6789</p>
          <p className="footer__description"><span>Hours:</span> 10:00 - 18:00, Mon - Sat</p>

          <div className="footer__social">
            <h4 className="footer__subtitle">Follow Me</h4>
            <div className="footer__social-links flex gap-2">
            {[facebookIcon, twitterIcon, instagramIcon, pinterestIcon, youtubeIcon].map((icon, i) => (
                <Link href="#" key={i}>
                  <Image src={icon} alt="social" className="footer__social-icon" height={25}/>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Address</h3>
          <ul className="footer__links">
            {['About us', 'Delivery Information', 'Privacy Policy', 'Terms & conditions', 'Contact Us', 'Support center'].map((item, i) => (
              <li key={i}>
                <Link href="#" className="footer__link">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">My Account</h3>
          <ul className="footer__links">
            {['login', 'cart', 'wishlist', 'account', 'help', 'shop'].map((path, i) => (
              <li key={i}>
                <Link href={`/${path}`} className="footer__link">
                  {path === 'help' ? 'Help' : path.charAt(0).toUpperCase() + path.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__content">
          <h3 className="footer__title">Secured Payment Gateways</h3>
          <Image src={paymentMethodImg} alt="Payment Methods" className="payment__img" />
        </div>
      </div>

      <div className="footer__bottom">
        <p className="copyright">
          © 2024 Evara. All rights reserved
        </p>
        <span className="designer">Designed by najme</span>
      </div>
    </footer>
  )
}

export default Footer
