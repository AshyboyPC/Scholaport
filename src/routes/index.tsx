import { Link, createFileRoute } from "@tanstack/react-router";
import { ScholaportLogo } from "@/components/ScholaportLogo";
import { useEffect, useRef, useState } from "react";
import { PremiumCheckCircleIcon, PremiumShieldIcon, PremiumSettingsIcon } from "@/components/icons/PremiumIcon";
import { ClayAsset } from "@/components/journey/JourneyVisuals";
import heroBgImage from "@/assets/images/hero-bg.png";

export const Route = createFileRoute("/")({
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

function WelcomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateNav = () => {
      setIsScrolled(window.scrollY > 24);
    };
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
    return () => window.removeEventListener("scroll", updateNav);
  }, []);

  return (
    <main className="bg-[#f5f6f4] text-[#0a175a] px-3 md:px-5 pb-0 marketing-page">
      
      {/* HEADER / HERO */}
      <header className="relative min-h-[760px] overflow-hidden rounded-b-[34px] bg-[#0a175a] text-white md:min-h-[820px]" id="home">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={heroBgImage} alt="" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a175a]/40 via-transparent to-[#0a175a]/90"></div>
        </div>
        
        {/* MORPHING NAVIGATION */}
        <nav className={`fixed z-50 top-0 left-1/2 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center ${
          isScrolled 
            ? "top-4 w-max h-[64px] pl-[180px] pr-[174px] rounded-[32px] bg-white/76 border border-white/42 shadow-[0_10px_32px_rgba(7,17,63,0.1),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-[18px] saturate-[1.1] text-[#344061]" 
            : "top-0 w-full max-w-7xl h-[90px] px-5 md:px-8 text-white"
        }`}>

          {/* LOGO (Always absolute) */}
          <Link to="/" aria-label="Scholaport home" className={`absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled ? "left-6" : "left-1/2 -translate-x-1/2"
          }`}>
            <ScholaportLogo className="h-7 sm:h-8 transition-colors duration-500" showWordmark inverse={!isScrolled} />
          </Link>

          {/* LINKS CONTAINER */}
          <div className={`hidden lg:flex items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled ? "w-max gap-1 mx-auto" : "w-full justify-between"
          }`}>
            
            {/* LEFT LINKS */}
            <div className={`flex items-center transition-all duration-700 ${isScrolled ? "gap-1" : "gap-7"}`}>
               <a href="#philosophy" className={`transition-all duration-300 text-[0.78rem] whitespace-nowrap ${isScrolled ? "px-5 py-2.5 hover:bg-black/5 rounded-full font-[800]" : "hover:text-white/70 font-[750]"}`}>Benefits</a>
               <a href="#infrastructure" className={`transition-all duration-300 text-[0.78rem] whitespace-nowrap ${isScrolled ? "px-5 py-2.5 hover:bg-black/5 rounded-full font-[800]" : "hover:text-white/70 font-[750]"}`}>Infrastructure</a>
            </div>

            {/* SPACER FOR LOGO (only active when not scrolled) */}
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? "w-0 opacity-0" : "w-[240px]" // Leaves space for the absolute logo
            }`}></div>

            {/* RIGHT LINKS */}
            <div className={`flex items-center transition-all duration-700 ${isScrolled ? "gap-1" : "gap-7"}`}>
               <a href="#how-it-works" className={`transition-all duration-300 text-[0.78rem] whitespace-nowrap ${isScrolled ? "px-5 py-2.5 hover:bg-black/5 rounded-full font-[800]" : "hover:text-white/70 font-[750]"}`}>Process</a>
               <a href="#beta" className={`transition-all duration-300 text-[0.78rem] whitespace-nowrap ${isScrolled ? "px-5 py-2.5 hover:bg-black/5 rounded-full font-[800]" : "hover:text-white/70 font-[750]"}`}>Evidence</a>
            </div>
          </div>

          {/* BUTTON (Always absolute) */}
          <div className={`absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled ? "right-2" : "right-5 md:right-8"
          }`}>
            <Link to="/app/login" className={`marketing-button transition-colors duration-500 h-[46px] ${
              isScrolled ? "marketing-button--ink" : "marketing-button--light"
            }`}>
              Open Scholaport
            </Link>
          </div>

        </nav>

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-6xl flex-col items-center px-5 pt-32 text-center md:min-h-[820px] md:px-8 md:pt-36">
          <h1 className="max-w-5xl text-[16vw] font-[800] leading-[0.98] tracking-[-0.06em] text-white md:text-[5.4rem]" style={{ fontFamily: "var(--font-display)" }}>
            <span className="block">Your academic record</span>
            <span className="block text-[0.8em] text-[#9ff2e6] mt-2">
              deserves a clear next chapter.
            </span>
          </h1>
          <p className="mt-9 max-w-xl text-[1rem] leading-[1.65] text-white/75 font-[560]">
            Scholaport turns a stack of coursework into a student-owned path for the next school
            system, without pretending the hard questions are simple.
          </p>
          <div className="relative mt-auto h-[250px] w-full max-w-[420px] md:h-[305px]">
             <div className="absolute bottom-1 left-1/2 h-24 w-72 -translate-x-1/2 rounded-[100%] bg-[#01c3ad]/30 blur-3xl"></div>
             
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[320px] h-[320px] md:w-[420px] md:h-[420px]">
                <ClayAsset asset="counselor-packet" eager className="w-full h-full object-contain drop-shadow-2xl" />
             </div>
          </div>
        </div>
      </header>

      {/* PHILOSOPHY / BENEFITS */}
      <section id="philosophy" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 md:grid-cols-[.7fr_1.5fr]">
          <div className="text-[0.67rem] font-[900] uppercase tracking-[0.1em] text-[#01a995]">
            <span className="mr-2 text-[#f86746] drop-shadow-[0_0_8px_rgba(248,103,70,0.4)]">●</span>
            The benefits
            <br />
            <span className="pl-5">of Scholaport</span>
          </div>
          <div>
            <h2 className="max-w-4xl text-[clamp(2.25rem,4vw,4rem)] font-[800] leading-[1.02] tracking-[-0.055em] text-[#0a175a]">
              A better view of what you already learned.
            </h2>
            <p className="mt-5 max-w-3xl text-[1.04rem] leading-[1.75] text-[#526079] font-[570]">
              Moving schools should not mean starting from zero. Scholaport gives your prior work a
              place to land, while keeping the boundaries of what the product can and cannot know in
              plain sight.
            </p>
            <Link to="/app/login" className="mt-7 inline-flex items-center gap-4 rounded-full bg-[#0a175a] px-5 py-2.5 text-[0.78rem] font-[800] text-white hover:-translate-y-0.5 transition-transform" style={{ boxShadow: "inset 0 1px 0 rgb(255 255 255 / 20%)" }}>
              Start your workspace
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#0a175a]">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-[.7fr_1fr_1fr]">
          <article className="flex min-h-[190px] overflow-hidden rounded-[24px] bg-[#fffdf8] border border-[#dde4e5] shadow-[0_2px_8px_rgba(10,23,90,0.08)]">
            <div className="relative w-2/5 overflow-hidden bg-[#0a175a]">
              <div className="absolute -left-8 top-8 h-28 w-28 rotate-[28deg] rounded-[28px] bg-[#01c3ad] shadow-[18px_20px_0_#01a995]"></div>
              <div className="absolute bottom-[-18px] right-[-20px] h-28 w-28 rounded-full border-[18px] border-white/35"></div>
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <span className="text-3xl font-[800] tracking-tight text-[#0a175a]">100%</span>
                <div className="text-xs font-[800] uppercase text-[#01a995]">Student-owned</div>
              </div>
              <p className="text-[10px] leading-[1.65] text-[#69758d] font-[620]">
                Your record stays yours, under your complete control.
              </p>
            </div>
          </article>
          <article className="relative min-h-[190px] overflow-hidden rounded-[24px] bg-[#0a175a] text-white shadow-[0_2px_8px_rgba(10,23,90,0.08)]">
            <div className="absolute inset-0 overflow-hidden bg-[#0a175a]">
              <div className="absolute -right-6 -top-8 h-48 w-48 rounded-full bg-[#01c3ad]/60 blur-sm"></div>
              <div className="absolute bottom-[-30px] right-[18%] h-40 w-40 rotate-[30deg] rounded-[34px] border border-white/40 bg-white/15 shadow-[20px_-16px_0_rgba(1,169,149,.28)]"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#07113f]/90 to-transparent"></div>
            <div className="relative flex h-full flex-col justify-between p-6">
              <div>
                <span className="text-3xl font-[800] tracking-tight">Clear</span>
                <div className="text-[0.67rem] font-[900] uppercase text-[#9ff2e6] tracking-[0.1em]">
                  Uncertainty labeled
                </div>
              </div>
              <p className="max-w-[190px] text-[10px] leading-relaxed text-white/70">
                Uncertain credit mapping results stay clearly labeled so you know what needs review.
              </p>
            </div>
          </article>
          <article className="flex min-h-[190px] flex-col justify-between rounded-[24px] bg-[#fffdf8] border border-[#dde4e5] p-6 shadow-[0_2px_8px_rgba(10,23,90,0.08)]">
            <div>
              <span className="text-3xl font-[800] tracking-tight text-[#0a175a]">Final</span>
              <div className="text-[0.67rem] font-[900] uppercase text-[#f86746] tracking-[0.1em]">School authority</div>
            </div>
            <p className="max-w-xs text-[10px] leading-[1.65] text-[#69758d] font-[620]">
              Schools and counselors always keep the final say on credit and graduation decisions.
            </p>
          </article>
        </div>
      </section>

      {/* INFRASTRUCTURE */}
      <section id="infrastructure" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="mb-12 grid gap-8 md:grid-cols-[.7fr_1.5fr]">
          <div className="text-[0.67rem] font-[900] uppercase tracking-[0.1em] text-[#01a995]">
            <span className="mr-2 text-[#f86746] drop-shadow-[0_0_8px_rgba(248,103,70,0.4)]">●</span>
            Engineered for clarity
          </div>
          <h2 className="max-w-4xl text-[clamp(2.25rem,4vw,4rem)] font-[800] leading-[1.02] tracking-[-0.055em] text-[#0a175a]">
            From a document pile to a route you can use.
          </h2>
        </div>

        <div className="grid items-end gap-5 md:grid-cols-[.45fr_.45fr_1.6fr]">
          <article className="flex min-h-[210px] flex-col justify-between rounded-[24px] bg-[#fffdf8] border border-[#dde4e5] p-6 shadow-[0_2px_8px_rgba(10,23,90,0.08)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bfebdd] text-[#0a175a]">
              <PremiumShieldIcon />
            </span>
            <div>
              <h3 className="text-[0.67rem] font-[900] uppercase tracking-[0.1em] text-[#0a175a]">Private by design</h3>
              <p className="mt-3 text-[10px] leading-[1.65] text-[#69758d] font-[620]">
                Clear controls and responsible data practices keep your transcript and plans safe.
              </p>
            </div>
          </article>
          <article className="flex min-h-[210px] flex-col justify-between rounded-[24px] bg-[#fffdf8] border border-[#dde4e5] p-6 shadow-[0_2px_8px_rgba(10,23,90,0.08)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe1d8] text-[#0a175a]">
              <PremiumSettingsIcon />
            </span>
            <div>
              <h3 className="text-[0.67rem] font-[900] uppercase tracking-[0.1em] text-[#0a175a]">Reliable support</h3>
              <p className="mt-3 text-[10px] leading-[1.65] text-[#69758d] font-[620]">
                Guidance remains available between meetings, deadlines, and moments of uncertainty.
              </p>
            </div>
          </article>
          <article className="relative min-h-[390px] overflow-hidden rounded-[26px] bg-[#07113f]">
            <div className="absolute inset-0 overflow-hidden bg-[#0a175a]">
              <div className="absolute -left-12 top-10 h-64 w-64 rotate-[24deg] rounded-[48px] bg-[#01c3ad]/60 shadow-[32px_34px_0_rgba(1,169,149,.26)]"></div>
              <div className="absolute right-[12%] top-[16%] h-44 w-44 rounded-full border-[22px] border-white/20"></div>
              <div className="absolute bottom-[-42px] right-[-24px] h-48 w-48 rounded-[42px] bg-white/10"></div>
              <div className="absolute -right-4 -top-4">
                <ClayAsset asset="secure-profile" className="w-56 h-64 object-contain opacity-90 drop-shadow-xl" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-[#07113f]/85 p-6 text-white backdrop-blur-md">
              <div className="mb-2 text-[0.67rem] font-[900] uppercase text-[#9ff2e6] tracking-[0.1em]">
                Counselor Handoff
              </div>
              <p className="max-w-xl text-[11px] leading-relaxed text-white/65">
                The workspace keeps the student’s transcript, possible credit connections,
                graduation questions, and counselor handoff in one calm place.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS / THE PASSAGE */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16">
        <div className="overflow-hidden rounded-[34px] bg-[#fffdf8] border border-[#dde4e5] shadow-[0_2px_8px_rgba(10,23,90,0.08)] px-6 py-12 md:px-12 md:py-16">
          <div className="grid items-center gap-10 md:grid-cols-[.9fr_1.1fr] md:gap-14">
            <div className="max-w-xl text-left">
              <p className="mb-4 text-[0.67rem] font-[900] uppercase tracking-[0.1em] text-[#01a995]">
                <span className="mr-2 text-[#f86746] drop-shadow-[0_0_8px_rgba(248,103,70,0.4)]">●</span>
                The passage, in three moves
              </p>
              <h2 className="text-[clamp(2.25rem,4vw,4rem)] font-[800] leading-[1.02] tracking-[-0.055em] text-[#0a175a]">
                A process you can
                <span className="relative inline-flex h-[.88em] w-[.88em] translate-y-[.08em] items-center justify-center rounded-full bg-[#01c3ad] text-[.48em] text-[#0a175a] mx-2 shadow-inner shadow-white/30">
                  ✦
                </span>
                actually <span className="text-[#01a995]">follow.</span>
              </h2>
              
              <div className="mt-10 space-y-8">
                <div className="flex gap-5">
                  <div className="font-[900] text-[#9da6b4] text-[0.64rem] tracking-[0.1em] mt-1.5">01</div>
                  <div>
                    <h3 className="font-[800] text-[#0a175a] text-[1.3rem] leading-[1.08] tracking-[-0.04em]">Bring your record together</h3>
                    <p className="text-[#69758d] text-[0.76rem] mt-2 font-[620] leading-[1.65]">Upload a transcript or enter courses in the language and format you already have.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="font-[900] text-[#9da6b4] text-[0.64rem] tracking-[0.1em] mt-1.5">02</div>
                  <div>
                    <h3 className="font-[800] text-[#0a175a] text-[1.3rem] leading-[1.08] tracking-[-0.04em]">See the likely connections</h3>
                    <p className="text-[#69758d] text-[0.76rem] mt-2 font-[620] leading-[1.65]">Review how courses may connect to your destination framework, with uncertainty kept visible.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="font-[900] text-[#9da6b4] text-[0.64rem] tracking-[0.1em] mt-1.5">03</div>
                  <div>
                    <h3 className="font-[800] text-[#0a175a] text-[1.3rem] leading-[1.08] tracking-[-0.04em]">Move with a clear plan</h3>
                    <p className="text-[#69758d] text-[0.76rem] mt-2 font-[620] leading-[1.65]">Understand what still needs attention and bring a counselor-ready packet to the conversation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative mx-auto flex h-[340px] w-full max-w-[520px] items-center justify-center md:h-[420px]">
              <div className="absolute h-48 w-48 rounded-full border border-[#0a175a]/10 md:h-64 md:w-64"></div>
              <div className="absolute h-36 w-36 rounded-full border border-[#01c3ad]/40 md:h-52 md:w-52"></div>
              <ClayAsset asset="academic-roadmap" className="w-[120%] h-[120%] object-contain scale-110 drop-shadow-2xl z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT / TRUST */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-16" aria-label="Scholaport impact">
        <div className="grid gap-3 md:grid-cols-3 md:grid-rows-[170px_170px]">
          <article className="row-span-2 flex min-h-[330px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#fffdf8] border border-[#dde4e5] p-5 shadow-sm">
            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-[18px] bg-[#f5f6f4]">
              <div className="absolute h-24 w-24 rotate-[-18deg] rounded-[24px] bg-[#01c3ad] shadow-[14px_16px_0_#9ff2e6,0_20px_26px_rgba(10,23,90,.16)]"></div>
              <div className="absolute h-20 w-20 rotate-[18deg] rounded-[20px] border border-white/80 bg-[#0a175a] shadow-[-13px_15px_0_#cdd3de]"></div>
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-[#0a175a] shadow-xl">
                ✦
              </div>
            </div>
            <div>
              <h3 className="max-w-[210px] text-[1.15rem] font-[800] leading-tight tracking-tight text-[#0a175a]">
                Built for the people behind every learning experience.
              </h3>
              <Link to="/app/login" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0a175a] px-4 py-2 text-[0.78rem] font-[800] text-white hover:-translate-y-0.5 transition-transform" style={{ boxShadow: "inset 0 1px 0 rgb(255 255 255 / 20%)" }}>
                Explore Scholaport
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm text-[#0a175a]">
                  →
                </span>
              </Link>
            </div>
          </article>
          <article className="relative overflow-hidden rounded-[24px] bg-[#e8efed] p-5 shadow-[0_1px_3px_rgba(10,23,90,0.08)]">
            <div className="absolute -right-2 -top-5 h-36 w-36 rounded-full bg-[#01c3ad] opacity-40 blur-2xl"></div>
            <div className="absolute right-7 top-4 h-24 w-24 rotate-[20deg] rounded-[22px] border border-white/80 bg-gradient-to-br from-white to-[#9ff2e6] shadow-[10px_14px_0_#0a175a]" style={{ transformStyle: "preserve-3d" }}></div>
            <div className="relative z-10 flex h-full flex-col justify-end">
              <h3 className="max-w-[190px] text-[1.15rem] font-[800] leading-tight tracking-tight text-[#0a175a]">
                Trusted by academic teams.
              </h3>
              <p className="mt-1 text-xs leading-[1.65] text-[#59647a] font-[600]">
                Designed around real learner needs.
              </p>
            </div>
          </article>
          <article className="relative overflow-hidden rounded-[24px] bg-[#fffdf8] border border-[#dde4e5] p-5 shadow-[0_1px_3px_rgba(10,23,90,0.08)]">
            <div className="absolute right-7 top-4">
              <div className="relative flex h-24 w-16 items-center justify-center rounded-b-[28px] rounded-t-[14px] bg-gradient-to-r from-[#0a175a] via-[#01c3ad] to-[#9ff2e6] shadow-[10px_14px_0_#cdd3de]">
                <div className="absolute -top-4 h-7 w-7 rotate-45 rounded-[5px] bg-[#f4c85a] shadow-md"></div>
                <div className="h-11 w-11 rounded-full border-4 border-white/50"></div>
              </div>
            </div>
            <div className="relative z-10 flex h-full flex-col justify-end">
              <div className="text-3xl font-[800] tracking-tight text-[#0a175a]">24/7</div>
              <p className="mt-1 max-w-[150px] text-[10px] leading-[1.65] text-[#69758d] font-[620]">
                Guidance ready when learners need it.
              </p>
            </div>
          </article>
          <article className="relative col-span-1 overflow-hidden rounded-[24px] bg-[#e8efed] p-5 md:col-span-2 shadow-[0_1px_3px_rgba(10,23,90,0.08)]">
            <div className="absolute -right-3 -bottom-6 h-44 w-44 rounded-full bg-[#0a175a] shadow-[-16px_-12px_0_#01c3ad]"></div>
            <div className="absolute bottom-7 right-11 h-28 w-28 rotate-[-12deg] rounded-[28px] border border-white/40 bg-[#9ff2e6] shadow-[14px_15px_0_#0a175a]" style={{ transformStyle: "preserve-3d" }}>
              <div className="absolute inset-5 rounded-full border-4 border-[#01c3ad] bg-white/60"></div>
            </div>
            <div className="relative z-10 flex h-full max-w-[290px] flex-col justify-end">
              <h3 className="text-[1.15rem] font-[800] leading-tight tracking-tight text-[#0a175a]">
                Bring every academic signal into focus and make the next step
                clearer.
              </h3>
              <p className="mt-1 text-[0.76rem] leading-[1.65] text-[#59647a] font-[600]">
                Support that adapts to each learner journey.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* BETA / EVIDENCE */}
      <section id="beta" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-2xl text-[clamp(2.25rem,4vw,4rem)] font-[800] leading-[1.02] tracking-[-0.055em] text-[#0a175a]">
            The beta is deliberately narrow.
          </h2>
          <p className="max-w-xs text-[1.04rem] leading-[1.75] text-[#526079] font-[570]">
            Scholaport is being shaped with real transfer decisions in mind.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-[26px] bg-[#0a175a] p-7 text-white shadow-md">
            <div className="text-3xl font-[800]">4+</div>
            <h3 className="mt-16 text-[1.15rem] font-[800]">Research studies</h3>
            <p className="mt-3 text-[0.76rem] leading-[1.65] text-white/72 font-[620]">
              Evidence supports the design and efficacy of the academic
              experience.
            </p>
          </article>
          <article className="rounded-[26px] bg-[#fffdf8] border border-[#dde4e5] p-7 shadow-[0_1px_3px_rgba(10,23,90,0.08)]">
            <div className="text-3xl font-[800] text-[#0a175a]">24/7</div>
            <h3 className="mt-16 text-[1.15rem] font-[800] text-[#0a175a]">Continuous availability</h3>
            <p className="mt-3 text-[0.76rem] leading-[1.65] text-[#69758d] font-[620]">
              Reliable support without waitlists or unnecessary operational
              overhead.
            </p>
          </article>
          <article className="rounded-[26px] bg-[#01c3ad] p-7 text-[#0a175a] shadow-md">
            <div className="text-3xl font-[800]">1M+</div>
            <h3 className="mt-16 text-[1.15rem] font-[800]">Satisfied users</h3>
            <p className="mt-3 text-[0.76rem] leading-[1.65] text-[#0a175a]/75 font-[620]">
              A proven foundation that grows with institutions and their
              learners.
            </p>
          </article>
        </div>
      </section>

      {/* EXISTING FOOTER (Preserved via BEM classes from styles.css) */}
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
            <Link to="/app/login">Sign in</Link>
            <Link to="/app/login">Create an account</Link>
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
