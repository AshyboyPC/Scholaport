import { useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PremiumHelpIcon, PremiumMapPointIcon } from "@/components/icons/PremiumIcon";
import poriGuideScene from "@/assets/images/faq/pori-guide-scene.png";
import faqScenesAtlas from "@/assets/images/faq/faq-scenes-atlas.png";

gsap.registerPlugin(ScrollTrigger);

type FaqItem = {
  question: string;
  answer: React.ReactNode;
  sceneLabel: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Who can use the complete Beta 1.0 workflow?",
    answer: (
      <>
        Beta 1.0 is built for high-school students bringing a{" "}
        <strong>Tamil Nadu State Board SSLC or HSC</strong> record, or an{" "}
        <strong>Andhra Pradesh SSC or Intermediate</strong> record, into either the{" "}
        <strong>Georgia high-school graduation framework</strong> or the{" "}
        <strong>Texas Foundation High School Program</strong>. Those four verified routes receive
        the connected transcript-review, probable-mapping, gap-analysis, roadmap, and counselor
        packet workflow. If either your source curriculum or destination is outside that scope, you
        can request the route, but the complete planning workflow is not yet available for it.
      </>
    ),
    sceneLabel: "A student choosing between supported academic transfer routes",
  },
  {
    question: "Does the current beta support CBSE or other Indian boards?",
    answer: (
      <>
        No. <strong>CBSE, CISCE, NIOS, IB, Cambridge, and other Indian boards</strong> are not part
        of the complete Beta 1.0 workflow. ScholaPort will not quietly force those records through a
        Tamil Nadu or Andhra Pradesh model. You may identify the curriculum and destination you need
        through the future-route waitlist; support will be added only after the relevant curriculum,
        policies, and destination requirements have been researched and validated.
      </>
    ),
    sceneLabel: "Curriculum folders waiting beside a future academic bridge",
  },
  {
    question: "Does ScholaPort make official credit, placement, or graduation decisions?",
    answer: (
      <>
        No. ScholaPort creates a <strong>student-owned planning preview</strong> from the courses you
        confirm, probable mappings, destination requirements, confidence indicators, and items
        marked for review. A probable mapping is not an official equivalency, awarded credit, course
        placement, or graduation approval. The receiving school and its authorized staff make every
        final academic decision using their own policies and review process.
      </>
    ),
    sceneLabel: "A receiving-school counselor reviewing a student's planning preview",
  },
  {
    question: "What exactly happens after I upload a transcript?",
    answer: (
      <>
        Your file is stored in your authenticated workspace and processed for academic text,
        including translation support where applicable. ScholaPort turns that text into{" "}
        <strong>editable course candidates</strong>—course names, grades, years, terms, and other
        relevant details—for you to inspect. Nothing moves into mapping or graduation planning until
        you correct any extraction issues and confirm the course records. The original document
        remains source context; the editable candidates are not treated as confirmed simply because
        they were extracted.
      </>
    ),
    sceneLabel: "A private transcript workstation converting a document into editable course cards",
  },
  {
    question: "What can I take to a counselor, and is anything shared automatically?",
    answer: (
      <>
        You can bring or print an organized counselor packet containing your{" "}
        <strong>confirmed courses, probable mappings, open or unclear requirements, saved actions,
        and prepared questions</strong>. The packet is meant to give the meeting a clearer starting
        point—not to replace the counselor&apos;s review. ScholaPort does not automatically send your
        transcript, packet, or planning results to a school. You decide when and how to share them.
      </>
    ),
    sceneLabel: "A student bringing an organized academic packet to a counselor meeting",
  },
  {
    question: "What happens when evidence is incomplete or a mapping is uncertain?",
    answer: (
      <>
        The uncertainty stays visible. Lower-confidence mappings remain labeled for review,
        unresolved requirements stay open, and missing reference coverage is identified rather than
        hidden. ScholaPort does not fill an evidence gap with a confident generated conclusion. The
        result tells you <strong>what is supported, what is probable, what is missing, and what a
        counselor still needs to decide</strong>.
      </>
    ),
    sceneLabel: "An academic route map with visible review markers and incomplete evidence",
  },
  {
    question: "Is there a mobile app, and what is planned after Beta 1.0?",
    answer: (
      <>
        Not yet. Beta 1.0 is a <strong>web application</strong> designed to work across modern
        desktop and mobile browsers. Native iOS and Android experiences are planned for MVP 2.0,
        alongside additional source and destination routes. Those routes will not appear simply
        because the mobile apps launch; each one must pass the same reference-coverage and validation
        process before its complete planning workflow becomes available.
      </>
    ),
    sceneLabel: "The web Academic Passport with future mobile experiences on the horizon",
  },
];

const scenePositions = [
  "0% 0%",
  "33.333% 0%",
  "66.667% 0%",
  "100% 0%",
  "0% 100%",
  "33.333% 100%",
  "66.667% 100%",
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const accordionId = useId();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const desktop = window.matchMedia("(min-width: 901px)").matches;
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            once: true,
          },
        });

        timeline
          .fromTo(
            ".faq-heading__eyebrow",
            { autoAlpha: 0, y: 12, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.48 },
          )
          .fromTo(
            ".faq-heading h2",
            { autoAlpha: 0, y: 30, clipPath: "inset(0 0 100% 0)" },
            {
              autoAlpha: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: 0.82,
              ease: "power4.out",
            },
            0.08,
          )
          .fromTo(
            ".faq-heading p",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.58 },
            0.24,
          )
          .fromTo(
            ".faq-guide",
            {
              autoAlpha: 0,
              x: desktop ? -42 : 0,
              y: desktop ? 16 : 28,
              scale: 0.985,
            },
            { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.76 },
            0.34,
          )
          .fromTo(
            ".faq-guide__art img",
            { scale: 1.055, y: 12 },
            { scale: 1, y: 0, duration: 1, ease: "power2.out" },
            0.4,
          )
          .fromTo(
            ".faq-card",
            { autoAlpha: 0, x: desktop ? 34 : 0, y: desktop ? 0 : 22 },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: 0.62,
              stagger: 0.065,
              ease: "power3.out",
            },
            0.42,
          );

        return () => timeline.kill();
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="faq-section"
      id="faq"
      aria-labelledby={`${accordionId}-title`}
    >
      <div className="faq-shell">
        <header className="faq-heading">
          <div className="faq-heading__eyebrow">
            <PremiumHelpIcon aria-hidden="true" />
            QUESTIONS BEFORE YOU JOIN
          </div>
          <h2 id={`${accordionId}-title`}>Clear answers before you carry your record forward.</h2>
          <p>
            Beta 1.0 is intentionally specific. These answers explain who it supports, where the
            boundaries are, and what remains in your—and your school&apos;s—control.
          </p>
        </header>

        <div className="faq-layout">
          <aside className="faq-guide" aria-label="Pori, your FAQ guide">
            <div className="faq-guide__art">
              <img
                src={poriGuideScene}
                alt="Pori standing on a grassy academic route leading toward a school gateway"
              />
            </div>
            <div className="faq-guide__copy">
              <span>Need a starting point?</span>
              <h3>Begin with your route.</h3>
              <p>
                Check your source curriculum and destination first. That determines whether the
                complete beta workflow is available to you.
              </p>
              <button type="button" onClick={() => setOpenIndex(0)}>
                <PremiumMapPointIcon aria-hidden="true" />
                Check Beta 1.0 eligibility
              </button>
            </div>
          </aside>

          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              const number = String(index + 1).padStart(2, "0");
              const triggerId = `${accordionId}-trigger-${index}`;
              const panelId = `${accordionId}-panel-${index}`;

              return (
                <article className={`faq-card${isOpen ? " faq-card--open" : ""}`} key={item.question}>
                  <button
                    type="button"
                    id={triggerId}
                    className="faq-card__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="faq-card__number">{number}</span>
                    <span className="faq-card__question">{item.question}</span>
                    <span className="faq-card__toggle" aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>

                  <div
                    className="faq-card__answer"
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    aria-hidden={!isOpen}
                  >
                    <div className="faq-card__answer-inner">
                      <span className="faq-card__watermark" aria-hidden="true">
                        {number}
                      </span>
                      <div className="faq-card__answer-copy">{item.answer}</div>
                      <div
                        className="faq-card__scene"
                        role="img"
                        aria-label={item.sceneLabel}
                        style={{
                          backgroundImage: `url(${faqScenesAtlas})`,
                          backgroundPosition: scenePositions[index],
                        }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <style>{faqStyles}</style>
    </section>
  );
}

const faqStyles = `
  .faq-section {
    width: 100%;
    padding: clamp(5.5rem, 9vw, 9rem) clamp(1rem, 3vw, 2rem);
    color: #0a175a;
    background:
      radial-gradient(circle at 16% 46%, rgba(1, 195, 173, 0.08), transparent 24rem),
      linear-gradient(180deg, #fffdf8 0%, #f6fbf8 100%);
  }

  .faq-shell {
    width: min(100%, 1400px);
    margin: 0 auto;
  }

  .faq-heading {
    max-width: 860px;
    margin: 0 auto clamp(3rem, 6vw, 5.5rem);
    text-align: center;
  }

  .faq-heading__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 1.1rem;
    color: #019a8a;
    font-size: 0.72rem;
    font-weight: 850;
    letter-spacing: 0.16em;
  }

  .faq-heading__eyebrow svg {
    width: 1rem;
    height: 1rem;
  }

  .faq-heading h2 {
    margin: 0;
    color: #0a175a;
    font-family: var(--font-display);
    font-size: clamp(2.6rem, 5.3vw, 5.4rem);
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.055em;
  }

  .faq-heading p {
    max-width: 680px;
    margin: 1.35rem auto 0;
    color: #5f6c82;
    font-size: clamp(0.98rem, 1.3vw, 1.12rem);
    font-weight: 540;
    line-height: 1.7;
  }

  .faq-layout {
    display: grid;
    grid-template-columns: minmax(280px, 0.78fr) minmax(0, 1.75fr);
    gap: clamp(2rem, 5vw, 5.5rem);
    align-items: start;
  }

  .faq-guide {
    position: sticky;
    top: 7rem;
  }

  .faq-guide__art {
    position: relative;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: 30px;
    background: #dfe5cd;
  }

  .faq-guide__art img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .faq-guide__copy {
    padding: 1.45rem 0.25rem 0;
  }

  .faq-guide__copy > span {
    color: #7b8698;
    font-size: 0.82rem;
    font-weight: 650;
  }

  .faq-guide__copy h3 {
    margin: 0.18rem 0 0.55rem;
    color: #0a175a;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.025em;
  }

  .faq-guide__copy p {
    margin: 0;
    color: #667286;
    font-size: 0.88rem;
    font-weight: 520;
    line-height: 1.65;
  }

  .faq-guide__copy button {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    margin-top: 1.15rem;
    border: 1px solid #d4e9e2;
    border-radius: 999px;
    padding: 0.72rem 1rem;
    color: #0a175a;
    background: #fff;
    box-shadow: 0 8px 24px rgba(10, 23, 90, 0.06);
    font-size: 0.78rem;
    font-weight: 760;
    cursor: pointer;
    transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
  }

  .faq-guide__copy button:hover {
    border-color: #8fd7cb;
    box-shadow: 0 10px 28px rgba(10, 23, 90, 0.1);
    transform: translateY(-1px);
  }

  .faq-guide__copy button svg {
    width: 1rem;
    height: 1rem;
    color: #01a995;
  }

  .faq-list {
    display: grid;
    gap: 0.7rem;
  }

  .faq-card {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(10, 23, 90, 0.07);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 6px 20px rgba(10, 23, 90, 0.035);
    transition:
      border-color 320ms ease,
      background-color 320ms ease,
      box-shadow 320ms ease;
  }

  .faq-card--open {
    border-color: rgba(1, 169, 149, 0.34);
    background: #fff;
    box-shadow: 0 18px 46px rgba(10, 23, 90, 0.1);
  }

  .faq-card__trigger {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 3.4rem minmax(0, 1fr) 2.6rem;
    gap: 0.85rem;
    align-items: center;
    width: 100%;
    min-height: 76px;
    border: 0;
    padding: 0.9rem 1.15rem 0.9rem 1rem;
    color: #0a175a;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  .faq-card__number {
    display: grid;
    place-items: center;
    width: 2.55rem;
    height: 2.55rem;
    border: 1px solid rgba(10, 23, 90, 0.08);
    border-radius: 12px;
    color: #788398;
    background: #f5f8f7;
    font-size: 0.78rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    transition: color 260ms ease, background-color 260ms ease, border-color 260ms ease;
  }

  .faq-card--open .faq-card__number {
    border-color: rgba(1, 169, 149, 0.22);
    color: #007f73;
    background: #e9f8f3;
  }

  .faq-card__question {
    padding-right: 0.75rem;
    font-size: clamp(0.98rem, 1.35vw, 1.13rem);
    font-weight: 760;
    line-height: 1.35;
    letter-spacing: -0.018em;
  }

  .faq-card__toggle {
    position: relative;
    display: grid;
    place-items: center;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: #0a175a;
    box-shadow: 0 6px 14px rgba(10, 23, 90, 0.18);
    transition: background-color 260ms ease, transform 360ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .faq-card__toggle span {
    position: absolute;
    width: 0.8rem;
    height: 1.5px;
    border-radius: 2px;
    background: white;
    transition: transform 280ms ease;
  }

  .faq-card__toggle span:last-child {
    transform: rotate(90deg);
  }

  .faq-card--open .faq-card__toggle {
    background: #01a995;
  }

  .faq-card--open .faq-card__toggle span:last-child {
    transform: rotate(0deg);
  }

  .faq-card__answer {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition:
      grid-template-rows 520ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 240ms ease;
  }

  .faq-card--open .faq-card__answer {
    grid-template-rows: 1fr;
    opacity: 1;
  }

  .faq-card__answer-inner {
    position: relative;
    min-height: 0;
    overflow: hidden;
  }

  .faq-card--open .faq-card__answer-inner {
    min-height: 290px;
  }

  .faq-card__answer-copy {
    position: relative;
    z-index: 2;
    width: min(64%, 590px);
    padding: 0.35rem 1.5rem 2.2rem 5.25rem;
    color: #5a6679;
    font-size: 0.93rem;
    font-weight: 520;
    line-height: 1.72;
  }

  .faq-card__answer-copy strong {
    color: #0a175a;
    font-weight: 780;
  }

  .faq-card__watermark {
    position: absolute;
    left: 0.85rem;
    bottom: -0.1em;
    z-index: 1;
    color: rgba(1, 169, 149, 0.08);
    font-family: var(--font-display);
    font-size: clamp(7rem, 12vw, 10rem);
    font-weight: 800;
    line-height: 0.72;
    letter-spacing: -0.09em;
    pointer-events: none;
  }

  .faq-card__scene {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    width: min(31%, 220px);
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 20px;
    background-repeat: no-repeat;
    background-size: 400% 200%;
    box-shadow: 0 16px 30px rgba(10, 23, 90, 0.16);
    transform: translateY(14px) scale(0.96);
    opacity: 0;
    transition:
      transform 540ms cubic-bezier(0.16, 1, 0.3, 1) 100ms,
      opacity 320ms ease 100ms;
  }

  .faq-card--open .faq-card__scene {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  .faq-card__trigger:focus-visible,
  .faq-guide__copy button:focus-visible {
    outline: 3px solid rgba(1, 195, 173, 0.42);
    outline-offset: 3px;
  }

  @media (max-width: 960px) {
    .faq-layout {
      grid-template-columns: 1fr;
    }

    .faq-guide {
      position: relative;
      top: auto;
      display: grid;
      grid-template-columns: minmax(220px, 0.65fr) 1fr;
      gap: 1.5rem;
      align-items: center;
    }

    .faq-guide__art {
      aspect-ratio: 2 / 3;
    }

    .faq-guide__copy {
      padding-top: 0;
    }
  }

  @media (max-width: 640px) {
    .faq-section {
      padding-inline: 0.75rem;
    }

    .faq-heading {
      padding-inline: 0.5rem;
    }

    .faq-guide {
      display: block;
    }

    .faq-guide__art {
      aspect-ratio: 2 / 3;
    }

    .faq-guide__copy {
      padding: 1.2rem 0.35rem 1rem;
    }

    .faq-card__trigger {
      grid-template-columns: 2.7rem minmax(0, 1fr) 2.3rem;
      gap: 0.65rem;
      min-height: 72px;
      padding-inline: 0.75rem;
    }

    .faq-card__number {
      width: 2.25rem;
      height: 2.25rem;
    }

    .faq-card__toggle {
      width: 2.15rem;
      height: 2.15rem;
    }

    .faq-card--open .faq-card__answer-inner {
      min-height: 0;
    }

    .faq-card__answer-copy {
      width: auto;
      padding: 0.25rem 1rem calc(100% - 0.25rem);
      font-size: 0.88rem;
    }

    .faq-card__watermark {
      display: none;
    }

    .faq-card__scene {
      right: 1rem;
      bottom: 1rem;
      left: 1rem;
      width: auto;
      height: auto;
      aspect-ratio: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .faq-card,
    .faq-card *,
    .faq-guide__copy button {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
