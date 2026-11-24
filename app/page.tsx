"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CurtainReveal from "@/components/CurtainReveal";
import { MusicProvider } from "@/components/MusicPlayer";

type EventItem = {
  id: string;
  isoDate: string; // YYYY-MM-DD — isi se order sort hota hai
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  mapUrl: string;
  details: string;
  image?: string;
};

const VENUE_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Siddhivinayak+Hall%2C+Kudal+Railway+Station+Road%2C+Kudal%2C+Sindhudurg%2C+Maharashtra+416520";

const HALDI_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Tendoli+Talewadi%2C+Kudal%2C+Sindhudurg%2C+Maharashtra";

const ENGAGEMENT_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Madhuwan%2C+Nemle%2C+Sawantwadi%2C+Sindhudurg%2C+Maharashtra";

// क्रम: साखरपुडा (शनिवार, २ जानेवारी) → हळद (रविवार, ३ जानेवारी) → विवाह (सोमवार, ४ जानेवारी)
const events: EventItem[] = [
  {
    id: "engagement",
    isoDate: "2027-01-02",
    title: "साखरपुडा",
    subtitle: "शुभमंगल साखरपुडा समारंभ",
    date: "शनिवार, दिनांक ०२ जानेवारी २०२७",
    time: "वेळ लवकरच कळविण्यात येईल",
    venue: "मधुवन, नेमळे, सावंतवाडी",
    mapUrl: ENGAGEMENT_MAP_URL,
    details:
      "शनिवार, दिनांक ०२ जानेवारी २०२७ रोजी मधुवन, नेमळे, सावंतवाडी येथे साखरपुडा समारंभ आयोजित केला आहे.",
    image: "/wedding/Traditional Marathi Engagement Invitation.png",
  },
  {
    id: "haldi",
    isoDate: "2027-01-03",
    title: "हळद समारंभ",
    subtitle: "मंगलमय हळदीचा सोहळा",
    date: "रविवार, दिनांक ०३ जानेवारी २०२७",
    time: "सायंकाळी ५:०० वाजता",
    venue: "तेंडोली (तळेवाडी), कुडाळ",
    mapUrl: HALDI_MAP_URL,
    details:
      "रविवार, दिनांक ०३ जानेवारी २०२७ रोजी सायंकाळी ५:०० वाजता तेंडोली (तळेवाडी), कुडाळ येथे हळद समारंभ आयोजित केला आहे.",
    image: "/wedding/Tejas and Mansi’s Marathi Wedding Invitation.png",
  },
  {
    id: "wedding",
    isoDate: "2027-01-04",
    title: "शुभविवाह",
    subtitle: "शुभमंगल सावधान",
    date: "सोमवार, दिनांक ०४ जानेवारी २०२७",
    time: "सकाळी ११:३५ वाजता",
    venue: "सिद्धिविनायक हॉल, कुडाळ",
    mapUrl: VENUE_MAP_URL,
    details:
      "मार्गशीर्ष कृ. १२, शके १९४८, सोमवार, दिनांक ०४ जानेवारी २०२७ रोजी सकाळी ११:३५ मिनिटांनी शुभ मुहूर्तावर विवाह आयोजित केला आहे.",
    image: "/wedding/ChatGPT Image Nov 23, 2026, 04_43_30 PM.png",
  },
];

// तारखेनुसार आपोआप क्रम लावतो (शनिवार → रविवार → सोमवार)
const sortedEvents = [...events].sort((a, b) =>
  a.isoDate.localeCompare(b.isoDate)
);

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // पाच सेकंद कोणतीही हालचाल/क्लिक नसल्यास पान हळूहळू खाली सरकेल.
  // वापरकर्ता पुन्हा interaction केल्यास scrolling थांबेल
  // आणि ५ सेकंदांनी पुन्हा सुरू होईल.
  useEffect(() => {
    if (selectedEvent) return;

    let idleTimer: ReturnType<typeof setTimeout>;
    let scrollTimer: ReturnType<typeof setInterval>;

    const stopAutoScroll = () => {
      if (scrollTimer) clearInterval(scrollTimer);
    };

    const startAutoScroll = () => {
      stopAutoScroll();

      scrollTimer = setInterval(() => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;

        if (maxScroll <= 0 || window.scrollY >= maxScroll - 2) {
          stopAutoScroll();
          return;
        }

        window.scrollBy({
          top: 1,
          left: 0,
          behavior: "auto",
        });
      }, 35);
    };

    const resetAutoScroll = () => {
      clearTimeout(idleTimer);
      stopAutoScroll();
      idleTimer = setTimeout(startAutoScroll, 5000);
    };

    const activityEvents = [
      "pointerdown",
      "wheel",
      "touchstart",
      "keydown",
    ] as const;

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetAutoScroll, {
        passive: true,
      });
    });

    resetAutoScroll();

    return () => {
      clearTimeout(idleTimer);
      stopAutoScroll();

      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetAutoScroll);
      });
    };
  }, [selectedEvent]);

  return (
    <MusicProvider>
      <main className="min-h-screen overflow-x-hidden bg-[#f7efe3] text-[#3a2d25]">
        <section className="relative min-h-screen overflow-hidden">
          {/* क्रीम-सोनेरी पार्श्वभूमी */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(210,171,120,0.18),transparent_34%),radial-gradient(circle_at_bottom,rgba(231,204,167,0.18),transparent_30%),linear-gradient(to_bottom,#fbf4e8,#f6ead8_55%,#f2e1c4)]" />

          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute left-[12%] top-[8%] h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" />
            <div className="absolute left-[24%] top-[18%] h-1 w-1 animate-pulse rounded-full bg-white/80" />
            <div className="absolute right-[16%] top-[11%] h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" />
            <div className="absolute right-[30%] top-[21%] h-1 w-1 animate-pulse rounded-full bg-white/80" />
            <div className="absolute left-[42%] top-[34%] h-1 w-1 animate-pulse rounded-full bg-white/80" />
            <div className="absolute right-[42%] top-[38%] h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" />
          </div>

          <CurtainReveal onOpen={() => setOpened(true)} />

          {/* पडदा उघडल्यानंतर दिसणारी सजावट */}
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[5] flex justify-center"
            initial={{ opacity: 0, y: -24 }}
            animate={
              opened
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: -24 }
            }
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img
              src="/curtains/open.webp"
              alt=""
              draggable={false}
              className="h-full w-full max-w-md select-none object-fill"
            />
          </motion.div>

          <motion.div
            className="relative z-10 mx-auto max-w-sm px-5 pb-10 pt-[22dvh]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={
              opened
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.96 }
            }
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex flex-col gap-5">
              {/* मुख्य निमंत्रण */}
              <section className="overflow-hidden rounded-[2rem] border border-white/20 bg-white/35 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                <div className="px-5 py-8 text-center">
                  <h2
                    className="font-serif text-3xl font-bold tracking-wide text-[#B22222]"
                    style={{
                      textShadow: "0 2px 6px rgba(227, 34, 34, 0.5)",
                    }}
                  >
                    ॥ श्री गणेशाय नमः ॥
                  </h2>

                  <div className="my-4 flex items-center justify-center">
                    <div className="h-px w-12 bg-[#C9A45A]" />
                    <span className="mx-3 text-lg text-[#C9A45A]">
                      ❦
                    </span>
                    <div className="h-px w-12 bg-[#C9A45A]" />
                  </div>

                  <p className="text-sm font-semibold leading-7 text-[#8B2635]">
                    ॥ श्री कुलस्वामी कल्याणपुरुष, श्री समाधीपुरुष,
                    श्री जगदंबा अनलादेवी प्रसन्न ॥
                  </p>

                  <p className="mt-5 text-sm font-semibold tracking-wide text-[#a5783f]">
                    सप्रेम नमस्कार विनंती विशेष
                  </p>

                  <p className="mt-5 text-sm leading-7 text-[#8B2635]">
                    “श्री” कृपाकस्त आमच्या येथे आमचे ज्येष्ठ चिरंजीव
                  </p>

                  <h1 className="mt-3 font-serif text-4xl font-bold text-[#8B2635]">
                    चि. तेजस
                  </h1>

                  <p className="mt-3 text-sm leading-7 text-[#6f3d3d]">
                    (श्रीमती अरुणा व कै. अच्युत श्रीपाद प्रभू यांचे सुपुत्र)
                    <br />
                    रा. तेंडोली, ता. कुडाळ, जि. सिंधुदुर्ग
                  </p>

                  <div className="my-4 flex items-center justify-center gap-4 text-[#C9A45A]">
                    <span>❧</span>
                    <span className="font-semibold text-[#8B2635]">
                      आणि
                    </span>
                    <span>❧</span>
                  </div>

                  <h2 className="font-serif text-3xl font-bold text-[#8B2635]">
                    चि. सौ. कां. मानसी
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-[#6f3d3d]">
                    (सौ. ज्योत्स्ना व श्री. जयराम मधुकर राऊळ यांची ज्येष्ठ कन्या,
                    <br />
                    कै. मधुकर भास्कर राऊळ यांची नात)
                    <br />
                    मू. नेमळे, ता. सावंतवाडी
                  </p>

                  <h3 className="mt-6 font-serif text-3xl font-bold text-[#8B2635]">
                    ॥ यांचा शुभविवाह ॥
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#8B2635]">
                    मार्गशीर्ष कृ. १२, शके १९४८, सोमवार,
                    <br />
                    दिनांक ०४ जानेवारी २०२७ रोजी
                    <br />
                    सकाळी ११:३५ मिनिटांनी या शुभ मुहूर्तावर
                    <br />
                    विवाह करण्याचे योजिले आहे.
                  </p>

                  <p className="mt-4 text-sm leading-7 text-[#8B2635]">
                    आपले आशीर्वाद वधूवरांस लाभावेत याकरिता सहकुटुंब,
                    सहपरिवार आपली उपस्थिती प्रार्थनीय आहे.
                  </p>
                </div>
              </section>

              {/* कार्यक्रम */}
              <section className="rounded-[2rem] border border-white/20 bg-white/35 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                <div className="text-center">
                  <p className="text-xs tracking-[0.2em] text-[#a5783f]">
                    मंगलमय सोहळे
                  </p>

                  <h3 className="mt-3 font-serif text-2xl text-[#3a2d25]">
                    विवाह सोहळ्याचे कार्यक्रम
                  </h3>
                </div>

                <div className="mt-5 space-y-4">
                  {sortedEvents.map((event, index) => (
                    <motion.button
                      key={event.id}
                      type="button"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.05,
                      }}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full rounded-[1.4rem] border border-[#ead9cd] bg-[#fffaf3] p-4 text-left shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
                    >
                      <div className="flex items-center gap-3">
                        {/* कार्यक्रमाची प्रतिमा किंवा सजावटीचे चिन्ह */}
                        {event.image ? (
                          <div className="h-24 w-20 flex-none overflow-hidden rounded-[1.1rem] border border-[#e5cfaa] bg-[#f5ead7] shadow-sm">
                            <img
                              src={event.image}
                              alt={`${event.title} निमंत्रण पत्रिका`}
                              className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="flex h-24 w-20 flex-none items-center justify-center rounded-[1.1rem] border border-[#e5cfaa] bg-[#f5ead7] text-3xl text-[#C9A45A]">
                            ❦
                          </div>
                        )}

                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                          <p className="text-xs text-[#a5783f]">
                            {event.subtitle}
                          </p>

                          <h4 className="mt-1 font-serif text-xl text-[#3a2d25]">
                            {event.title}
                          </h4>

                          <p className="mt-1 text-xs text-[#6f5b4d]">
                            {event.date}
                          </p>

                          <p className="text-xs text-[#6f5b4d]">
                            {event.time}
                          </p>

                          <p className="mt-1 text-xs text-[#8B2635]">
                            {event.venue}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* विवाहस्थळ */}
              <section className="rounded-[2rem] border border-white/20 bg-white/35 p-5 text-center shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                <p className="text-xs tracking-[0.2em] text-[#a5783f]">
                  विवाहस्थळ
                </p>

                <h3 className="mt-3 font-serif text-2xl text-[#3a2d25]">
                  सिद्धिविनायक हॉल
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#6f5b4d]">
                  इंग्लिश स्कूलजवळ,
                  <br />
                  कुडाळ रेल्वे स्टेशन रोड,
                  <br />
                  सिंधुदुर्ग – ४१६५२०
                </p>

                <a
                  href={VENUE_MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-full border border-[#c9a37b] px-5 py-2 text-sm text-[#3a2d25]"
                >
                  नकाशा पहा
                </a>
              </section>

              {/* निवासस्थान */}
              <section className="rounded-[2rem] border border-white/20 bg-white/35 p-5 text-center shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                <p className="text-xs tracking-[0.2em] text-[#a5783f]">
                  निवासस्थान
                </p>

                <h3 className="mt-3 font-serif text-2xl text-[#3a2d25]">
                  तेंडोली (तळेवाडी)
                </h3>

                <p className="mt-2 text-sm leading-7 text-[#6f5b4d]">
                  मु. पो. तेंडोली (तळेवाडी),
                  <br />
                  कुडाळ, सिंधुदुर्ग – ४१६५२०
                </p>
              </section>

              {/* निमंत्रक */}
              <footer className="mt-4 px-3 pb-5 text-center">
                <p className="text-sm leading-7 text-[#8B2635]">
                  वरील विनंतीस मान देऊन अगत्य यावे,
                  <br />
                  ही नम्र विनंती.
                </p>

                <div className="my-4 text-2xl text-[#C9A45A]">
                  ❦
                </div>

                <h2 className="font-serif text-2xl text-[#8B2635]">
                  चि. तेजस
                </h2>

                <div className="my-2 text-xl text-[#C9A45A]">
                  आणि
                </div>

                <h2 className="font-serif text-2xl text-[#8B2635]">
                  चि. सौ. कां. मानसी
                </h2>
              </footer>
            </div>
          </motion.div>

          {/* कार्यक्रमाची माहिती आणि संपूर्ण निमंत्रण प्रतिमा */}
          <AnimatePresence>
            {selectedEvent && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-3 sm:p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedEvent(null)}
              >
                <motion.div
                  initial={{ scale: 0.96, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 10 }}
                  transition={{ duration: 0.3 }}
                  onClick={(event) => event.stopPropagation()}
                  className="mx-auto flex max-h-[94dvh] w-full max-w-md flex-col overflow-y-auto rounded-2xl border border-[#ead9cd] bg-[#fffaf3] p-3 text-center text-[#3a2d25] sm:p-4"
                >
                  {/* पूर्ण निमंत्रण प्रतिमा */}
                  {selectedEvent.image ? (
                    <div className="flex shrink-0 justify-center overflow-hidden rounded-xl bg-[#f5ead7]">
                      <img
                        src={selectedEvent.image}
                        alt={`${selectedEvent.title} निमंत्रण पत्रिका`}
                        className="mx-auto max-h-[60dvh] w-auto max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-36 shrink-0 flex-col items-center justify-center rounded-xl border border-[#e5cfaa] bg-[#f5ead7]">
                      <span className="text-4xl text-[#C9A45A]">
                        ❦
                      </span>
                      <p className="mt-2 font-serif text-lg text-[#8B2635]">
                        शुभमंगल साखरपुडा
                      </p>
                    </div>
                  )}

                  {/* कार्यक्रमाची माहिती */}
                  <div className="shrink-0 pt-3">
                    <p className="text-xs text-[#a5783f]">
                      {selectedEvent.subtitle}
                    </p>

                    <h4 className="mt-1 font-serif text-xl font-bold text-[#8B2635]">
                      {selectedEvent.title}
                    </h4>

                    <p className="mt-2 text-xs leading-5">
                      {selectedEvent.date}
                    </p>

                    <p className="text-xs leading-5">
                      {selectedEvent.time}
                    </p>

                    <p className="mt-1 text-xs leading-5">
                      {selectedEvent.venue}
                    </p>

                    <p className="mt-3 px-2 text-xs leading-6 text-[#6f5b4d]">
                      {selectedEvent.details}
                    </p>

                    <a
                      href={selectedEvent.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex rounded-full border border-[#c9a37b] px-4 py-2 text-xs text-[#3a2d25]"
                    >
                      नकाशा पहा
                    </a>

                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(null)}
                        className="mt-2 rounded-full border border-[#8B2635] px-5 py-2 text-xs text-[#8B2635]"
                      >
                        बंद करा
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </MusicProvider>
  );
}