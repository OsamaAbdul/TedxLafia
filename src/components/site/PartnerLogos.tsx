export function PartnerLogos() {
  const partnerImages = [
    { name: "MSD Designs", logo_url: "/partners/msddesigns.jpg" },
    { name: "Dan Sarki", logo_url: "/partners/dansarki.jpg" },
    { name: "O2 Inn", logo_url: "/partners/o2inn.png" },
  ];

  return (
    <section className="border-y border-border bg-background py-16 overflow-hidden flex justify-center">
      {/* Mobile Marquee */}
      <div className="flex md:hidden w-max animate-marquee items-center">
        {[0, 1].map((key) => (
          <div key={key} className="flex gap-16 items-center pr-16 shrink-0">
            {partnerImages.map((p, i) => (
              <div key={i} className="flex items-center justify-center shrink-0">
                <img
                  src={p.logo_url}
                  alt={p.name}
                  loading="lazy"
                  className="max-h-32 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop Static */}
      <div className="hidden md:flex flex-wrap justify-center gap-24 items-center px-8 w-full max-w-5xl mx-auto">
        {partnerImages.map((p, i) => (
          <div key={i} className="flex items-center justify-center shrink-0">
            <img
              src={p.logo_url}
              alt={p.name}
              loading="lazy"
              className="max-h-40 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
