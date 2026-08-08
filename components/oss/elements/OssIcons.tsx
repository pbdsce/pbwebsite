import Image from "next/image";

function StatIcon({
  alt,
  className,
  height,
  src,
  width,
}: {
  alt: string;
  className: string;
  height: number;
  src: string;
  width: number;
}) {
  return (
    <Image
      alt={alt}
      aria-hidden="true"
      className={className}
      height={height}
      src={src}
      width={width}
    />
  );
}

export function PrStatIcon({ size = 24 }: { size?: number }) {
  return (
    <StatIcon
      alt=""
      className="h-full w-full"
      height={size}
      src="/icons/oss/pr-stat.svg"
      width={Math.round((size * 59) / 67)}
    />
  );
}

export function OrgStatIcon({ size = 24 }: { size?: number }) {
  return (
    <StatIcon
      alt=""
      className="h-full w-full"
      height={size}
      src="/icons/oss/org-stat.svg"
      width={Math.round((size * 18) / 24)}
    />
  );
}

export function ContributorStatIcon({ size = 27 }: { size?: number }) {
  return (
    <StatIcon
      alt=""
      className="h-full w-full"
      height={size}
      src="/icons/oss/contributor-stat.svg"
      width={size}
    />
  );
}

export function GithubMarkIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30C23.2843 30 30 23.2843 30 15Z"
        fill="currentColor"
      />
      <path
        clipRule="evenodd"
        d="M19.2748 29.0784C17.8138 29.5536 16.2545 29.8105 14.6357 29.8105C13.0158 29.8105 11.4556 29.5532 9.99373 29.0775C10.669 29.1584 10.9185 28.7187 10.9185 28.3391C10.9185 28.1738 10.9157 27.8823 10.9119 27.4924C10.9076 27.0412 10.9019 26.4582 10.8979 25.7864C6.7251 26.6935 5.84479 23.7741 5.84479 23.7741C5.16323 22.0405 4.17979 21.5788 4.17979 21.5788C2.8176 20.6472 4.28292 20.6661 4.28292 20.6661C5.7876 20.7721 6.57979 22.2131 6.57979 22.2131C7.91854 24.507 10.0907 23.8446 10.9457 23.4599C11.0817 22.4899 11.4698 21.8283 11.8982 21.4531C8.56729 21.0742 5.06573 19.787 5.06573 14.0353C5.06573 12.3963 5.64979 11.0567 6.60979 10.0068C6.4551 9.62702 5.94042 8.10152 6.75604 6.03476C6.75604 6.03476 8.01604 5.63131 10.881 7.57334C12.0782 7.24021 13.3607 7.07434 14.6367 7.06759C15.9107 7.07409 17.1942 7.24021 18.3923 7.57334C21.2554 5.63131 22.5126 6.03476 22.5126 6.03476C23.331 8.10152 22.8164 9.62702 22.6617 10.0068C23.6235 11.0567 24.2039 12.3963 24.2039 14.0353C24.2039 19.801 20.6967 21.0705 17.3554 21.442C17.8935 21.9054 18.3735 22.821 18.3735 24.2217C18.3735 25.5635 18.3652 26.7316 18.3596 27.5058C18.3569 27.8893 18.3548 28.1761 18.3548 28.3393C18.3548 28.7207 18.5983 29.1613 19.2748 29.0784Z"
        fill="#191919"
        fillRule="evenodd"
      />
    </svg>
  );
}
