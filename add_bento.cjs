const fs = require('fs');
let content = fs.readFileSync('src/routes/index.tsx', 'utf8');

const imports = `import bentoTranscript from "@/assets/scholaport-journey/transcript-upload.png";
import bentoGap from "@/assets/scholaport-journey/requirement-gap.webp";
import bentoRoadmap from "@/assets/scholaport-journey/academic-roadmap.png";
import bentoPacket from "@/assets/scholaport-journey/counselor-packet.png";
import bentoPassport from "@/assets/images/academic-passport-bento.png";
import bentoProgression from "@/assets/images/level-progression-bento.png";
import { Check, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";`;

content = content.replace('import { ChevronRight } from "lucide-react";', `import { ChevronRight } from "lucide-react";\n${imports}`);

const bentoSection = `      {/* FEATURES BENTO SECTION */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-24 md:px-10">
        <div className="mb-6 flex items-center gap-2">
          <span className="w-[7px] h-[7px] rounded-full bg-[#01a995]" />
          <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995]">FEATURES</span>
        </div>
        
        <div className="mb-16">
          <h2 className="text-[clamp(1.9rem,3.4vw,3.1rem)] font-[800] leading-[1.15] tracking-[-0.04em] text-[#0a175a]">
            From records to a clear route.<br />
            All in ScholaPort.
          </h2>
          <p className="mt-4 max-w-2xl text-[1.1rem] leading-[1.6] text-[#69758d] font-[500]">
            Every tool counselors need to review, plan, and guide with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Transcript Review (2x2) */}
          <article className="col-span-1 md:col-span-2 lg:row-span-2 lg:col-span-2 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#0a175a] p-8 lg:p-10 text-white relative">
            <div className="z-10 w-full max-w-[60%]">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995] mb-4 block">TRANSCRIPT REVIEW</span>
              <h3 className="text-3xl lg:text-4xl font-[800] leading-[1.15] tracking-[-0.02em] mb-4">
                Review the record<br />before it moves forward.
              </h3>
              <p className="text-[#a5b4c9] text-sm lg:text-base leading-relaxed mb-8 max-w-sm">
                Upload, map, and confirm every course so nothing gets missed.
              </p>
              
              <ul className="space-y-4 text-sm text-[#d4dfed]">
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#01a995]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  Map courses to requirements
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#01a995]">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  Detect gaps and mismatches
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#01a995]">
                    <Check className="w-4 h-4" />
                  </div>
                  Lock in an accurate record
                </li>
              </ul>
            </div>
            
            <img src={bentoTranscript} alt="Transcript Upload" className="absolute -right-12 top-[10%] w-[55%] object-contain drop-shadow-2xl z-0" />
            
            <div className="z-10 mt-12 self-start rounded-[16px] border border-white/10 bg-[#07113f]/80 p-5 backdrop-blur-md">
              <div className="text-[10px] font-[800] uppercase tracking-widest text-[#a5b4c9] mb-3">REVIEW STATUS</div>
              <div className="flex gap-6 mb-4">
                <div className="text-center"><div className="text-xl font-bold">5</div><div className="text-[10px] text-[#a5b4c9]">Mapped</div></div>
                <div className="text-center"><div className="text-xl font-bold">5</div><div className="text-[10px] text-[#a5b4c9]">Matched</div></div>
                <div className="text-center"><div className="text-xl font-bold">5</div><div className="text-[10px] text-[#a5b4c9]">Confirmed</div></div>
              </div>
              <button className="w-full rounded-full bg-[#01a995] py-2 text-xs font-bold text-white transition-colors hover:bg-[#018b7a]">
                View gap analysis &rarr;
              </button>
            </div>
          </article>

          {/* Gap Analysis (1x2) */}
          <article className="col-span-1 lg:row-span-2 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#fff6f0] p-8 text-[#0a175a] relative">
            <div className="z-10">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#ff7a59] mb-4 block">GAP ANALYSIS</span>
              <h3 className="text-2xl font-[800] leading-[1.15] tracking-[-0.02em] mb-6">
                See what looks satisfied, missing, or unclear.
              </h3>
              <div className="space-y-4 bg-white/60 p-4 rounded-2xl backdrop-blur-sm border border-white/80">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#01a995] text-white">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">16.5</div>
                    <div className="text-[10px] text-[#69758d]">Likely earned</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffb703] text-white">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">5</div>
                    <div className="text-[10px] text-[#69758d]">Missing credits</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff7a59] text-white">
                    <HelpCircle className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">1</div>
                    <div className="text-[10px] text-[#69758d]">Review items</div>
                  </div>
                </div>
              </div>
            </div>
            
            <img src={bentoGap} alt="Gap Analysis" className="absolute -right-8 bottom-20 w-[90%] object-contain drop-shadow-xl z-0" />
            
            <button className="z-10 mt-48 w-max rounded-full bg-white px-5 py-2 text-xs font-bold text-[#0a175a] shadow-sm transition-shadow hover:shadow-md border border-[#f0e6e0]">
              Open gap analysis &rarr;
            </button>
          </article>

          {/* Make Pori your own (1x1) */}
          <article className="col-span-1 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#f0fbf7] p-8 text-[#0a175a] relative">
            <div className="z-10 w-1/2">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995] mb-2 block">Your companion</span>
              <h3 className="text-xl font-[800] leading-[1.15] tracking-[-0.02em] mb-4">
                Make Pori your own
              </h3>
              <ul className="space-y-2 text-[11px] font-[600] text-[#4a5568]">
                {["Base", "Expression", "Head", "Accessory", "Detail"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#01a995] text-white">
                      <Check className="w-2.5 h-2.5" strokeWidth={4} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <img src={customAsset5} alt="Pori Customization" className="absolute -right-8 -bottom-4 w-[60%] object-contain drop-shadow-lg z-0" />
          </article>

          {/* Academic Roadmap (1x1) */}
          <article className="col-span-1 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#f0fbf7] p-8 text-[#0a175a] relative">
            <div className="z-10 relative">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995] mb-2 block">ACADEMIC ROADMAP</span>
              <h3 className="text-xl font-[800] leading-[1.15] tracking-[-0.02em] mb-2">
                Move one clear step at a time.
              </h3>
              <p className="text-xs text-[#69758d] mb-4 max-w-[80%] leading-relaxed font-[500]">
                Resolve the local elective, then unlock the remaining schedule.
              </p>
              <div className="inline-block rounded-full bg-[#d9f2e9] px-3 py-1 text-[10px] font-[800] text-[#01a995]">
                Next: Local Elective
              </div>
            </div>
            <img src={bentoRoadmap} alt="Academic Roadmap" className="absolute -right-2 -bottom-2 w-[110%] object-contain drop-shadow-xl z-0" />
            <button className="z-10 mt-20 w-max rounded-full bg-white px-5 py-2 text-xs font-bold text-[#0a175a] shadow-sm transition-shadow hover:shadow-md border border-[#e2ede9]">
              View roadmap &rarr;
            </button>
          </article>

          {/* Counselor Packet (1x1) */}
          <article className="col-span-1 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#f0f6ff] p-8 text-[#0a175a] relative">
            <div className="z-10 w-2/3">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#3b82f6] mb-2 block">COUNSELOR PACKET</span>
              <h3 className="text-xl font-[800] leading-[1.15] tracking-[-0.02em] mb-3">
                A printable packet that's ready when you are.
              </h3>
              <p className="text-[11px] font-[500] text-[#69758d] mb-12">
                Summarize the plan, mapping, gaps, and next steps.
              </p>
            </div>
            <img src={bentoPacket} alt="Counselor Packet" className="absolute -right-4 bottom-2 w-[60%] object-contain drop-shadow-xl z-0" />
            <button className="z-10 mt-auto w-max rounded-full bg-white px-4 py-2 text-xs font-bold text-[#0a175a] shadow-sm transition-shadow hover:shadow-md border border-[#e2ebf5] flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print / Save PDF
            </button>
          </article>

          {/* Academic Passport (1x1) */}
          <article className="col-span-1 flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#f0fbf7] p-8 text-[#0a175a] relative">
            <div className="z-10 w-3/5">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995] mb-2 block">ACADEMIC PASSPORT</span>
              <h3 className="text-xl font-[800] leading-[1.15] tracking-[-0.02em] mb-2">
                One template, made personal.
              </h3>
              <p className="text-[10px] font-[500] text-[#69758d] mb-6">
                Customize appearance and personal details.
              </p>
              
              <div className="space-y-3 mb-8 bg-white/70 backdrop-blur-sm p-3 rounded-[14px] border border-white">
                <div className="flex items-center justify-between text-[9px] font-bold">
                  Cover color
                  <div className="flex gap-1.5">
                    {["#0a175a", "#01a995", "#ff7a59", "#ffb703"].map(c => <div key={c} className="w-3.5 h-3.5 rounded-full" style={{backgroundColor: c}}></div>)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold">
                  Accent color
                  <div className="flex gap-1.5">
                    {["#0a175a", "#01a995", "#ff7a59", "#ffb703"].map(c => <div key={c} className="w-3.5 h-3.5 rounded-full" style={{backgroundColor: c}}></div>)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold">
                  Icon style
                  <div className="flex gap-1.5">
                    <div className="w-4 h-4 rounded-[4px] border-[1.5px] border-[#01a995] flex items-center justify-center bg-[#f0fbf7]"><img src={customAsset5} className="w-3" /></div>
                    <div className="w-4 h-4 rounded-[4px] bg-white border border-gray-200 flex items-center justify-center text-[8px] text-gray-400">★</div>
                    <div className="w-4 h-4 rounded-[4px] bg-white border border-gray-200 flex items-center justify-center text-[8px] text-gray-400">★</div>
                  </div>
                </div>
              </div>
            </div>
            <img src={bentoPassport} alt="Academic Passport" className="absolute -right-8 top-8 w-[55%] object-contain drop-shadow-2xl z-0" />
            <button className="z-10 mt-auto w-max rounded-full bg-white px-4 py-2 text-xs font-bold text-[#0a175a] shadow-sm transition-shadow hover:shadow-md border border-[#e2ede9]">
              Customize Passport &rarr;
            </button>
          </article>

          {/* Level Progression (2x1) */}
          <article className="col-span-1 md:col-span-2 overflow-hidden rounded-[24px] bg-[#0a175a] p-8 text-white relative flex flex-col justify-between">
            <div className="z-10 mb-2 max-w-sm">
              <span className="text-[0.65rem] font-[900] uppercase tracking-[0.14em] text-[#01a995] mb-2 block">LEVEL PROGRESSION</span>
              <h3 className="text-2xl font-[800] leading-[1.15] tracking-[-0.02em] mb-2">
                Each rank follows real work.
              </h3>
              <p className="text-[#a5b4c9] text-xs font-[500]">
                Complete tasks, earn ranks, and unlock new milestones.
              </p>
            </div>
            
            <img src={bentoProgression} alt="Level Progression Timeline" className="w-[100%] max-w-[550px] object-contain self-start lg:self-center mt-2 z-10 drop-shadow-xl" />
          </article>

        </div>
      </section>\n\n      {/* PROCESS SECTION */}`;

content = content.replace('{/* PROCESS SECTION */}', bentoSection);

fs.writeFileSync('src/routes/index.tsx', content);
console.log('Successfully added bento grid');
