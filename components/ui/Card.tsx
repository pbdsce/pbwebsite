import Image from 'next/image';

interface CardProps {
  name: string;
  role: string;
  company: string;
  linkedInUrl?: string;
  imageUrl?: string;
}

const Card: React.FC<CardProps> = ({ name, role, company, linkedInUrl, imageUrl }) => {
  return (
    <div className="flex flex-col w-full rounded-xl overflow-hidden border border-gray-700 bg-black shadow-lg transition-transform hover:-translate-y-1 hover:shadow-white hover:shadow-md">
      
      {imageUrl && linkedInUrl && (
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full aspect-[3/4]"
        >
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </a>
      )}

      <div className="p-4 flex flex-col items-center text-center gap-1">
        <p className="text-lg font-bold text-white">{name}</p>
        <p className="text-sm text-gray-300">{role}</p>
        <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#a2d240] to-[#1b8b00]">
          {company}
        </p>
      </div>
    </div>
  );
};

export default Card;
