"use client"
import s  from "./Slider.module.scss"
import {FC, ReactNode, useEffect, useState} from "react"

type CarouselProps = {
  children: Array<ReactNode>,
  timeout?: number,
  paginationPosition?: 'center' | 'bottom'
}

export const Carousel:FC<CarouselProps> = ({children, timeout = 7500, paginationPosition = 'center'}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (timeout > 50) {
      const intervalId = setInterval(() => {
        const nextIndex = activeIndex === children.length - 1 ? 0 : activeIndex + 1
        setActiveIndex(nextIndex)
      }, timeout)
      return () => clearInterval(intervalId)
    }
  }, [activeIndex])

  const handleClick = (index: number) => {
      setActiveIndex(index)
  }

  return (
    <div className={s.swiperWrapper}>
      <div className={s.swiper} style={{width: `${children.length * 100}%`}}>
        {children.map((item, index) => (
          <div
            style={{transform: `translateX(-${activeIndex * 100}%)`}}
            className={`${s.slide} ${activeIndex === index ? s.active : s.disabled}`}
            key={index}
          >
            {item}
          </div>
        ))}
      </div>
      <div className={s.pagination + ' ' + s[paginationPosition]}>
        {children.map((_, index) => (
          <div
            className={`${s.dot} ${activeIndex === index ? s.active : ''}`}
            key={index}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  )
}