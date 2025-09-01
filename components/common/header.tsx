// components/layout/Header.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Heart, ShoppingCart, Menu, X } from 'lucide-react'
import logo from '@/public/images/logo.svg'
import Image from 'next/image'
import { signOut} from "next-auth/react"
import { useSessionContext } from '@/lib/contexts/session-context'
import { useCart } from '@/lib/contexts/cart-context';
import Loading from './loading'

export default function Header() {
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(!showMenu)
  const { user,  status } = useSessionContext();
  const { cart, loading } = useCart();

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__container container">
          <div className="header__contact">
            <span>(+01)-2345-6789</span>
            <span>Our location</span>
          </div>
          <p className="header__alert-news">Super Value Deals - Save more with coupons</p>
          {status=="loading"?  <div className="header__top-action">loading ...</div> :
          user ? (
            <div className="header__top-action">
              <Link href="/account">{user.username}</Link> {/* Link to account page */}
              {" - "}
              <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="logout-btn"
    >
      Sign Out
    </button>
            </div>
          ) : (
            <Link href="/login" className="header__top-action">
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>

      <nav className="nav section">
        <Link href="/" className="nav__logo">
          <Image src={logo} alt="Logo" className="nav__logo-img" />
        </Link>

        <div className={`nav__menu ${showMenu ? 'show-menu' : ''}`} id="nav__menu">
          <div className="nav__menu-top">
            <Link href="/" className="nav__menu-logo">
              <Image src={logo} alt="Logo" />
            </Link>
            <div className="nav__close" onClick={toggleMenu}>
              <X size={20} className='icon'/>
            </div>
          </div>

          <ul className="nav__list">
            {['/', '/shop', '/account', '/compare', '/login'].map((path, index) => (
              <li key={index} className="nav__item">
                <Link href={path} className="nav__link">
                  {path === '/' ? 'Home' : path.replace('/', '').replace('-', ' ')}
                </Link>
              </li>
            ))}
          </ul>

          <form action="/shop" method="GET" className="header__search">
  <input
    type="text"
    name="search"
    placeholder="Search for items..."
    className="form__input"
    defaultValue=""
  />
  <button type="submit" className="search__btn">
    <Search size={18} className="icon" />
  </button>
</form>

        </div>

        <div className="header__user-actions">
          <Link href="/wishlist" className="header__action-btn">
            <Heart size={20} className='icon' />
            <span className="count">0</span>
          </Link>

          <Link href="/cart" className="header__action-btn">
            <ShoppingCart size={20} className='icon' />
            {loading ?<span className="count">...</span> : <span className="count">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>}
            
          </Link>

          <div className="header__action-btn nav__toggle" onClick={toggleMenu}>
            <Menu size={20} className='icon'/>
          </div>
        </div>
      </nav>
    </header>
  )
}


