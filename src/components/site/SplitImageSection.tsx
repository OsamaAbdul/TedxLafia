import { Reveal } from "./Reveal";

interface SplitImageSectionProps {
  eyebrow: string;
  title: string | React.ReactNode;
  image: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
}

export function SplitImageSection({ eyebrow, title, image, imageAlt, imagePosition = "left" }: SplitImageSectionProps) {
  const isImageRight = imagePosition === "right";
  
  return (
    <section className="bg-black text-white relative flex flex-col-reverse lg:block pt-12 lg:pt-0">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 items-center min-h-[400px] lg:min-h-[600px] py-16 lg:py-0">
          <div className={`max-w-xl ${isImageRight ? 'lg:pr-12' : 'lg:pl-12 lg:col-start-2'}`}>
            <Reveal>
              <p className="eyebrow text-white/50 mb-4 sm:mb-6">{eyebrow}</p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-5xl">
                {title}
              </h2>
            </Reveal>
          </div>
        </div>
      </div>
      <div className={`relative h-[400px] sm:h-[500px] lg:absolute lg:inset-y-0 ${isImageRight ? 'lg:right-0' : 'lg:left-0'} lg:w-1/2 lg:h-full w-full`}>
        <div className="absolute inset-y-0 left-0 w-24 sm:w-32 lg:w-48 xl:w-64 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-32 lg:w-48 xl:w-64 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-x-0 top-0 h-24 sm:h-32 lg:h-48 bg-gradient-to-b from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 lg:h-48 bg-gradient-to-t from-black via-black/90 to-transparent z-10" />
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover object-center absolute inset-0"
        />
      </div>
    </section>
  );
}
