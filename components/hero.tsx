import Logo from '@/public/images/logo.png'
import Link from 'next/link'
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import "../app/css/additional-styles/landing.css";


export default function Hero() {
  return (
    <section className="relative md:h-screen flex justify-center items-center div-class">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 ">
        <div className="pt-32 pb-5 md:pt-40 md:pb-5">
          <div className="pb-5 md:pb-5">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h1 className="text-5xl font-extrabold leading-tighter tracking-tighter mb-4 text-gray-200" data-aos="zoom-y-out"></h1>
                  <p className="text-xl text-gray-100 mb-8" data-aos="zoom-y-out" data-aos-delay="150"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
    </section>
  )
}