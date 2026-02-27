import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function Figure({ src, alt, caption, width = 800, height = 450 }: FigureProps) {
  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
