'use client';
import Link from "next/link";
import homeImg from "@/public/images/home-img.png"
import Image from "next/image";
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';
import Countdown from "@/components/home/countdown";


import Tshirt from '@/public/images/category-1.jpg';
import Bags from '@/public/images/category-2.jpg';
import Sandal from '@/public/images/category-3.jpg';
import Scarf from '@/public/images/category-4.jpg';
import Shoes from '@/public/images/category-5.jpg';
import Pillowcase from '@/public/images/category-6.jpg';
import Jumpsuit from '@/public/images/category-7.jpg';
import Hats from '@/public/images/category-8.jpg';
import { ChevronLeft, ChevronRight } from "lucide-react";

const categoryData = [
  { to: '/shop?category=t-shirt', imgSrc: Tshirt, title: 'Tshirt' },
  { to: '/shop?category=bag', imgSrc: Bags, title: 'Bags' },
  { to: '/shop?category=sandal', imgSrc: Sandal, title: 'Sandal' },
  { to: '/shop?category=scarf', imgSrc: Scarf, title: 'Scarf' },
  { to: '/shop?category=shoes', imgSrc: Shoes, title: 'Shoes' },
  { to: '/shop?category=pillowcase', imgSrc: Pillowcase, title: 'Pillowcase' },
  { to: '/shop?category=jumpsuit', imgSrc: Jumpsuit, title: 'Jumpsuit' },
  { to: '/shop?category=hat', imgSrc: Hats, title: 'Hats' },
];

const breakpoints = {
  350: {
    slidesPerView: 2,
    spaceBetween: 24,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 24,
  },
  992: {
    slidesPerView: 4,
    spaceBetween: 24,
  },
  1200: {
    slidesPerView: 5,
    spaceBetween: 24,
  },
  1400: {
    slidesPerView: 6,
    spaceBetween: 24,
  },
};
export default function Home() {
  const targetDate1 = '2026-09-01T00:00:00';
  const targetDate2 = '2025-10-01T11:00:00';
  return (
     <section className="home section__lg">
          <div className="home__container container grid">
            <div className="home__content">
              <span className="home__subtitle">Hot promotions</span>
              <h1 className="home__title">Fashion Trending <span>Great Collection</span></h1>
              <p className="home__description">
                Save more with coupons & up to 20% off
              </p>
              <Link href="/shop" className="btn">Shop Now</Link>
            </div>
    
            <Image src={homeImg} alt="home-image" className="home__img" loading="lazy"/>

          </div>

          <section className="categories container section">
      <h3 className="section__title">
        <span>Popular</span> categories
      </h3>
      <div className="categories__container swiper">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          loop={true}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ el: '.swiper-pagination' }}
          breakpoints={breakpoints}
        >
          {categoryData.map((category) => (
            <SwiperSlide key={category.title} className="category__item swiper-slide">
              <Link href={category.to}>
                <div className="category__item-link">
                  <Image src={category.imgSrc} alt={category.title} width={200} height={200} className="category__img" loading="lazy"/>
                  <h3 className="category__title">{category.title}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}

          <div className="swiper-button-next">
          <ChevronRight strokeWidth={1.5} />
          </div>
          <div className="swiper-button-prev">
            <ChevronLeft strokeWidth={1.5}/>
          </div>
        </Swiper>
      </div>
    </section>
    <section className="deals section">
      <div className="deals__container container grid">
        {/* Deal 1 */}
        <div className="deals__item">
          <div className="deals__group">
            <h3 className="deals__brand">Deal of the day</h3>
            <span className="deals__category">Limited quantities</span>
          </div>

          <h4 className="deals__title">Summer Collection New Modern Design</h4>

          <div className="deals__price flex">
            <span className="new__price">$139</span>
            <span className="old__price">$159.99</span>
          </div>

          <div className="deals__group">
            <p className="deals__countdown-text">Hurry Up! Offer ends in:</p>
            <Countdown targetDate={targetDate1} />
          </div>

          <div className="deals__btn">
            <Link href="/shop" className="btn btn__md">Shop now!</Link>
          </div>
        </div>

        {/* Deal 2 */}
        <div className="deals__item">
          <div className="deals__group">
            <h3 className="deals__brand">Women clothing</h3>
            <span className="deals__category">Limited quantities</span>
          </div>

          <h4 className="deals__title">Try something new on vacation</h4>

          <div className="deals__price flex">
            <span className="new__price">$139</span>
            <span className="old__price">$159.99</span>
          </div>

          <div className="deals__group">
            <p className="deals__countdown-text">Hurry Up! Offer ends in:</p>
            <Countdown targetDate={targetDate2} />
          </div>

          <div className="deals__btn">
            <Link href="/shop" className="btn btn__md">Shop now!</Link>
          </div>
        </div>
      </div>
    </section>
        </section>
  );
}
