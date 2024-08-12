"use client"
import s  from "./Slider.module.scss"
import {FC, useEffect, useState} from "react"
import Image from "next/image"

const items = ['/full.jpg', '/full1.jpg', '/full2.jpg', '/full3.jpg']

export const Carousel:FC = ({children}: any) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
      setActiveIndex(nextIndex)
    }, 5000)
    return () => clearInterval(intervalId)
  }, [activeIndex])

  const handleClick = (index: number) => {
      setActiveIndex(index)
  }

  return (
    <div className={s.swiperWrapper}>
      <div className={s.swiper}>
        {items.map((item, index) => (
          <div
            style={{transform: `translateX(-${activeIndex * 100}%)`}}
            className={`${s.slide} ${activeIndex === index ? s.active : s.disabled}`}
            key={item}
          >
            <Image
              draggable={false}
              className={s.image}
              src={'/mainSlider' + item}
              alt={item}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
              width={1920}
              height={800}
            />
          </div>
        ))}
        <div className={s.pagination}>
            {items.map((_, index) => (
              <div
                className={`${s.dot} ${activeIndex === index ? s.active : ''}`}
                key={index}
                onClick={() => handleClick(index)}
              />
            ))}
        </div>
      </div>
    </div>
  )
}