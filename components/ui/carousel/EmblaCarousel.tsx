import React, { useEffect, useCallback, useRef } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButton'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import './styles.css';

type PropType = {
  slides: string[]
  options?: EmblaOptionsType
  autoplayDelay?: number 
  autoplayEnabled?: boolean 
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { 
    slides, 
    options, 
    autoplayDelay = 3000, 
    autoplayEnabled = true 
  } = props

  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const startAutoplay = useCallback(() => {
    if (!autoplayEnabled || !emblaApi) return;

    stopAutoplay();

    autoplayTimerRef.current = setInterval(() => {
      if (!emblaApi.canScrollNext()) {
        emblaApi.scrollTo(0);
      } else {
        emblaApi.scrollNext();
      }
    }, autoplayDelay);
  }, [emblaApi, autoplayDelay, autoplayEnabled]);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    startAutoplay();

    emblaApi.on('pointerDown', stopAutoplay);
    emblaApi.on('settle', startAutoplay);

    return () => {
      stopAutoplay();
      emblaApi.off('pointerDown', stopAutoplay);
      emblaApi.off('settle', startAutoplay);
    };
  }, [emblaApi, startAutoplay, stopAutoplay]);

  const onMouseEnter = useCallback(() => {
    stopAutoplay();
  }, [stopAutoplay]);

  const onMouseLeave = useCallback(() => {
    startAutoplay();
  }, [startAutoplay]);

  return (
    <section className="embla">
      <div 
        className="embla__viewport relative" 
        ref={emblaRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="embla__container">
          {slides.map((imageUrl, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__img relative">
                <Image
                  className="embla__slide__img"
                  src={imageUrl}
                  alt={`Slide ${index}`}
                  width={500}
                  height={500}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto ml-3">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          </div>
          <div className="pointer-events-auto mr-3">
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>
        </div>

        <div className="absolute bottom-3 left-0 right-0">
          <div className="embla__dots flex justify-center">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={'embla__dot hover:scale-110 transition-transform duration-300'.concat(
                  index === selectedIndex ? ' embla__dot--selected' : ''
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel