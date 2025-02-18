import { cn } from "@/lib/server/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    img: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setHoveredIndex(null);
  }, [items]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 py-10 items-center justify-items-center w-[80%] mx-auto",
        className
      )}
    >
      {items.map((item, idx) => (
        <motion.div
          key={item.title}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-[90%] bg-green-200 dark:bg-green-900/[0.8] blur-md block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardIcon img={item.img} />
            <CardTitle>{item.title}</CardTitle>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-[90%] p-4 justify-center overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-green-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardIcon = ({
  className,
  img,
}: {
  className?: string;
  img: string;
}) => {
  return (
    <div className={cn("flex justify-center mb-9 items-center", className)}>
      <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
        <Image src={img} alt="" width={64} height={64} className="rounded-full" />
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h3
      className={cn(
        "text-zinc-100 font-bold tracking-wide text-xl align-center justify-center text-center",
        className
      )}
    >
      {children}
    </h3>
  );
};
