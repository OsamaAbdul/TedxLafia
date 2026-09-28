import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { RegisterBanner } from "@/components/site/RegisterBanner";

export const Route = createFileRoute("/why-join-us")({
  head: () => ({
    meta: [
      { title: "Why Join Us — TEDxLafia" },
      { name: "description", content: "Discover why you should join our community of innovative thinkers." }
    ]
  }),
  component: WhyJoinUsPage
});

function WhyJoinUsPage() {
  return (
    <>
      <PageHero
        eyebrow="Join Us"
        title={
          <div className="text-4xl sm:text-5xl lg:text-6xl">
            Why Join
            <span className="block italic text-primary">TEDx Lafia?</span>
          </div>
        }
        bgImages={["/teaM/team-3.jpeg"]}
      />

      <section className="section-pad bg-black text-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <Reveal>
            <div className="space-y-16">
              
              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-primary mb-6 uppercase tracking-wide">Spark Your Innovation</h2>
                <p className="text-xl text-white/90 leading-relaxed font-light mb-6">
                  Igniting your curiosity and inspire you to take action. Here, you will discover groundbreaking ideas, connect with passionate minds, and be empowered to create positive change in the world around you.
                </p>
                <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                  <p>
                    In today's rapidly evolving world, innovation is no longer a luxury but a necessity. It is the driving force behind economic growth, social progress, and personal fulfillment. However, the spark that ignites innovation can often be elusive. At TEDxLafia, you will learn to spark the untapped innovative potential within you and recognize that innovation is not solely the domain of geniuses or tech titans but a skill that can be cultivated and honed.
                  </p>
                  <p>
                    Sparking innovation resides in your curiosity, your willingness to question the status quo, and your ability to connect seemingly unrelated ideas. It is the moment when you step outside of your comfort zones and embrace new perspectives. TEDxLafia platform is dedicated to sharing ideas worth spreading and is at the forefront of sparking innovation. Through this event, we are bringing together diverse thinkers, creators, and visionaries to share their insights that will inspire You.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-primary mb-6 uppercase tracking-wide">Get Inspired</h2>
                <p className="text-xl text-white/90 leading-relaxed font-light mb-6">
                  Let the inspiration from TEDxLafia ignite your creativity and drive you towards achieving your goals. We invite you to open your mind, explore different possibilities, and find the fuel that will inspire you to pursue your passions.
                </p>
                <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                  <p>
                    Inspiration is the spark that ignites the human spirit. It is the catalyst for creativity, innovation, and personal growth. At TEDxLafia, we believe that ideas have the power to transform lives and shape the world.
                  </p>
                  <p>
                    We invite you to immerse yourself in the world of TEDxLafia. Here, you will encounter a diverse range of speakers who are passionate about their fields and committed to sharing their knowledge with the world. Their talks will challenge your assumptions, broaden your horizons, and ignite your imagination.
                  </p>
                  <p>
                    Let the inspiration from TEDxLafia fuel your creativity. Discover new ways of thinking, explore unconventional approaches, and unleash your inner innovator. Whether you are an artist, scientist, entrepreneur, or simply someone curious about the world, there is something at TEDxLafia for you.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-primary mb-6 uppercase tracking-wide">Become a Leader</h2>
                <p className="text-xl text-white/90 leading-relaxed font-light mb-6">
                  Becoming a leader is far more than having a title; It's the sum of all the people you influenced, the lives you inspired, and the narratives you changed. Join the TEDxLafia and discover the hidden leadership qualities within you.
                </p>
                <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                  <p>
                    Leadership is often misunderstood as a position or a title. However, true leadership transcends these superficial markers. It is deeply rooted in influence, inspiration, and the power to shape narratives. A leader is someone who leaves an indelible mark on the world, not through authority but through impact.
                  </p>
                  <p>
                    At TEDxLafia, we believe that leadership resides within every individual. It's about unlocking your potential, discovering your unique voice, and using it to make a difference. Our platform provides a space for you to connect with like-minded individuals, explore groundbreaking ideas, and cultivate the leadership qualities that lie dormant within you.
                  </p>
                  <p>
                    Remember, leadership is not about dominating but empowering. It's about serving others, building bridges, and creating a better future. Let TEDxLafia be the catalyst for your leadership journey.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-primary mb-6 uppercase tracking-wide">Forge Lasting Relationships</h2>
                <p className="text-xl text-white/90 leading-relaxed font-light mb-6">
                  By becoming part of a selected group of 1500+ innovative minds from across Nigeria and beyond.
                </p>
                <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                  <p>
                    At TEDxLafia, you would have the unique opportunity to join a carefully curated community of innovative thinkers, creators, and change-makers from across Nigeria and beyond. This diverse, interdisciplinary network is the perfect place to forge meaningful connections and collaborate on transformative ideas that can shape the future. By becoming part of this selected group, you will expand your circle of influence and unlock the power of diverse perspectives.
                  </p>
                  <p>
                    The connections you forge at TEDxLafia can serve as springboards for groundbreaking collaborations. Whether you're looking to launch a new venture, spearhead a social impact initiative, or simply expand your professional network, this community offers unparalleled opportunities to work alongside like-minded innovators who are driven to create positive change.
                  </p>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      <RegisterBanner />
    </>
  );
}
