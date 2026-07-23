import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check, FileText, Map, Route as RouteIcon } from "lucide-react";

import { ScholaportLogo } from "@/components/ScholaportLogo";
import { ClayAsset } from "@/components/journey/JourneyVisuals";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Scholaport | Your academic passage" },
      {
        name: "description",
        content:
          "Scholaport helps internationally mobile students organize transcripts, understand likely credit paths, and prepare for the next school system.",
      },
    ],
  }),
  component: WelcomePage,
});

const journeySteps = [
  {
    number: "01",
    title: "Bring your record together",
    copy: "Upload a transcript or enter courses in the language and format you already have.",
    icon: FileText,
  },
  {
    number: "02",
    title: "See the likely connections",
    copy: "Review how courses may connect to your destination framework, with uncertainty kept visible.",
    icon: Map,
  },
  {
    number: "03",
    title: "Move with a clear plan",
    copy: "Understand what still needs attention and bring a counselor-ready packet to the conversation.",
    icon: RouteIcon,
  },
] as const;

const principles = [
  "Your record stays yours.",
  "Uncertain results stay clearly labeled.",
  "Schools and counselors keep the final say.",
] as const;

function WelcomePage() {
  return (
    <main className="marketing-page">
      <header className="marketing-nav-wrap">
        <nav className="marketing-nav marketing-shell" aria-label="Main navigation">
          <Link to="/welcome" className="marketing-nav__brand" aria-label="Scholaport home">
            <ScholaportLogo className="h-9 sm:h-10" showWordmark />
          </Link>
          <div className="marketing-nav__links" aria-label="Page sections">
            <a href="#how-it-works">How it works</a>
            <a href="#beta">Beta</a>
            <a href="#principles">Principles</a>
          </div>
          <Link to="/login" className="marketing-nav__action">
            Open Scholaport <ArrowUpRight aria-hidden="true" />
          </Link>
        </nav>
      </header>

      <section className="marketing-hero" aria-labelledby="welcome-title">
        <div className="marketing-shell marketing-hero__layout">
          <div className="marketing-hero__copy">
            <p className="marketing-kicker">
              <span aria-hidden="true" /> Private beta for international high-school transfers
            </p>
            <h1 id="welcome-title">Your academic record deserves a clear next chapter.</h1>
            <p className="marketing-lede">
              Scholaport turns a stack of coursework into a student-owned path for the next school
              system, without pretending the hard questions are simple.
            </p>
            <div className="marketing-hero__actions">
              <Link to="/login" className="marketing-button marketing-button--light">
                Start your workspace <ArrowRight aria-hidden="true" />
              </Link>
              <a href="#how-it-works" className="marketing-text-link">
                See the passage <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="marketing-hero__note">
              Planning support for students and counselors. Not an official transcript evaluation.
            </p>
          </div>

          <div className="marketing-hero__art" aria-label="A Scholaport academic journey preview">
            <div className="marketing-hero__route" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="marketing-stage-card marketing-stage-card--source">
              <span className="marketing-stage-card__label">Starting point</span>
              <strong>Your coursework</strong>
              <small>Transcript and curriculum</small>
            </div>
            <div className="marketing-stage-card marketing-stage-card--destination">
              <span className="marketing-stage-card__label">Next system</span>
              <strong>Your requirements</strong>
              <small>Framework and graduation path</small>
            </div>
            <ClayAsset asset="source-curriculum" eager className="marketing-hero__source-art" />
            <ClayAsset
              asset="destination-framework"
              eager
              className="marketing-hero__destination-art"
            />
            <div className="marketing-stage-card marketing-stage-card--center">
              <div className="marketing-stage-card__brand">
                <ScholaportLogo className="h-7" />
                <span>Academic passage</span>
              </div>
              <div className="marketing-stage-card__line" />
              <div className="marketing-stage-card__summary">
                <span>Transcript</span>
                <b>→</b>
                <span>Plan</span>
              </div>
              <p>Clear enough to act on. Honest enough to trust.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-intro" id="principles" aria-labelledby="principles-title">
        <div className="marketing-shell marketing-intro__grid">
          <div>
            <p className="marketing-section-label">Made for a real transition</p>
            <h2 id="principles-title">A better view of what you already learned.</h2>
          </div>
          <div className="marketing-intro__body">
            <p>
              Moving schools should not mean starting from zero. Scholaport gives your prior work a
              place to land, while keeping the boundaries of what the product can and cannot know in
              plain sight.
            </p>
            <ul>
              {principles.map((principle) => (
                <li key={principle}>
                  <Check aria-hidden="true" />
                  {principle}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="marketing-product" aria-labelledby="product-title">
        <div className="marketing-shell">
          <div className="marketing-product__frame">
            <div className="marketing-product__eyebrow">
              <span>Scholaport workspace</span>
              <span className="marketing-product__status">Private beta</span>
            </div>
            <div className="marketing-product__body">
              <div className="marketing-product__copy">
                <p className="marketing-section-label">A student-owned workspace</p>
                <h2 id="product-title">From a document pile to a route you can use.</h2>
                <p>
                  The workspace keeps the student’s transcript, possible credit connections,
                  graduation questions, and counselor handoff in one calm place.
                </p>
                <Link to="/login" className="marketing-button marketing-button--ink">
                  Explore the workspace <ArrowRight aria-hidden="true" />
                </Link>
              </div>
              <div className="marketing-product__preview" aria-label="Product workflow preview">
                <div className="marketing-preview__topline">
                  <ScholaportLogo className="h-7" showWordmark />
                  <span>My academic passage</span>
                </div>
                <div className="marketing-preview__map">
                  <div className="marketing-preview__marker marketing-preview__marker--start">
                    01
                  </div>
                  <div className="marketing-preview__marker marketing-preview__marker--middle">
                    02
                  </div>
                  <div className="marketing-preview__marker marketing-preview__marker--end">03</div>
                </div>
                <div className="marketing-preview__labels">
                  <span>Transcript</span>
                  <span>Mapping review</span>
                  <span>Next actions</span>
                </div>
                <div className="marketing-preview__footer">
                  <span>Questions stay visible until they are resolved.</span>
                  <span className="marketing-preview__ready">Ready for review</span>
                </div>
              </div>
            </div>
            <ClayAsset asset="credit-mapping" className="marketing-product__asset" />
          </div>
        </div>
      </section>

      <section className="marketing-steps" id="how-it-works" aria-labelledby="steps-title">
        <div className="marketing-shell">
          <div className="marketing-steps__heading">
            <p className="marketing-section-label">The passage, in three moves</p>
            <h2 id="steps-title">A process you can actually follow.</h2>
          </div>
          <div className="marketing-steps__list">
            {journeySteps.map((step) => {
              const Icon = step.icon;
              return (
                <article className="marketing-step" key={step.number}>
                  <div className="marketing-step__number">{step.number}</div>
                  <div className="marketing-step__icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="marketing-beta" id="beta" aria-labelledby="beta-title">
        <div className="marketing-shell marketing-beta__layout">
          <div className="marketing-beta__copy">
            <p className="marketing-kicker marketing-kicker--ink">
              <span aria-hidden="true" /> Built carefully, in the open
            </p>
            <h2 id="beta-title">The beta is deliberately narrow.</h2>
            <p>
              Scholaport is being shaped with real transfer decisions in mind. Coverage is shown
              honestly, and the product leaves final credit and graduation decisions with schools.
            </p>
            <Link to="/login" className="marketing-button marketing-button--light">
              Create a beta workspace <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="marketing-beta__art">
            <div className="marketing-beta__stamp">BETA</div>
            <ClayAsset asset="counselor-packet" className="marketing-beta__packet" />
            <div className="marketing-beta__note">
              <span>Designed to support</span>
              <strong>students, families, and counselors</strong>
            </div>
          </div>
        </div>
      </section>

      <footer className="marketing-footer">
        <div className="marketing-shell marketing-footer__grid">
          <div className="marketing-footer__brand">
            <ScholaportLogo className="h-11" showWordmark inverse />
            <p>
              A clear academic passage for students carrying their learning across school systems.
            </p>
          </div>
          <div className="marketing-footer__links">
            <a href="#how-it-works">How it works</a>
            <a href="#beta">Private beta</a>
            <Link to="/login">Sign in</Link>
            <Link to="/login">Create an account</Link>
          </div>
          <div className="marketing-footer__note">
            <span>Scholaport is a planning workspace.</span>
            <span>Schools retain final academic decision-making.</span>
          </div>
        </div>
        <div className="marketing-footer__wordmark" aria-hidden="true">
          SCHOLAPORT
        </div>
      </footer>
    </main>
  );
}
