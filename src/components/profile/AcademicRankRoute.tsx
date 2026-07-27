import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import type { CSSProperties } from "react";
import passageReady from "@/assets/ranks/passage-ready.png";
import passportHolder from "@/assets/ranks/passport-holder.png";
import creditMapper from "@/assets/ranks/credit-mapper.png";
import gapNavigator from "@/assets/ranks/gap-navigator.png";
import recordKeeper from "@/assets/ranks/record-keeper.png";
import routeBuilder from "@/assets/ranks/route-builder.png";
import wayfinder from "@/assets/ranks/wayfinder.png";
import type { AcademicRankId, AcademicRankProgress } from "@/lib/academic-ranks";
import { scheduleRankTaskFocus } from "@/lib/rank-task-navigation";
import { cn } from "@/lib/utils";

const rankAssets: Record<AcademicRankId, string> = {
  wayfinder,
  "passport-holder": passportHolder,
  "record-keeper": recordKeeper,
  "credit-mapper": creditMapper,
  "gap-navigator": gapNavigator,
  "route-builder": routeBuilder,
  "passage-ready": passageReady,
};

const routePositions = [
  { x: "50%", y: "170px", mobileX: "14.9%", mobileY: "190px", side: "right" },
  { x: "31%", y: "400px", mobileX: "20%", mobileY: "470px", side: "right" },
  { x: "66%", y: "650px", mobileX: "13.8%", mobileY: "750px", side: "left" },
  { x: "38%", y: "900px", mobileX: "20%", mobileY: "1030px", side: "right" },
  { x: "70%", y: "1150px", mobileX: "14.4%", mobileY: "1310px", side: "left" },
  { x: "32%", y: "1400px", mobileX: "20.5%", mobileY: "1590px", side: "right" },
  { x: "55%", y: "1650px", mobileX: "15.9%", mobileY: "1870px", side: "right" },
] as const;

const desktopRoutePath =
  "M500 170 C500 270 280 280 310 400 C340 520 710 510 660 650 C610 790 320 770 380 900 C440 1030 750 1010 700 1150 C650 1290 260 1260 320 1400 C375 1530 610 1520 550 1650";
const mobileRoutePath =
  "M58 190 C58 290 94 350 78 470 C63 575 36 655 54 750 C78 845 96 930 78 1030 C54 1125 39 1215 56 1310 C78 1405 98 1500 80 1590 C64 1675 45 1780 62 1870";

export function AcademicRankRoute({
  progress,
  backendSynced = false,
}: {
  progress: AcademicRankProgress;
  backendSynced?: boolean;
}) {
  const currentIndex = progress.current.level - 1;
  const nextPercent = Math.round(progress.nextProgress * 100);
  const primaryNextCheck = progress.nextChecks.find((check) => !check.complete);
  const routeProgress = progress.next
    ? Math.min(1, (currentIndex + progress.nextProgress) / (progress.ranks.length - 1))
    : 1;

  return (
    <>
      <section className="academic-rank-hero" aria-labelledby="current-rank-title">
        <p className="sr-only" aria-live="polite">
          Current level {progress.current.level}, {progress.current.name}.
          {progress.next ? ` Progress to ${progress.next.name}: ${nextPercent} percent.` : ""}
        </p>
        <div className="academic-rank-hero__copy">
          <div className="flex flex-wrap items-center gap-2">
            <span className="academic-rank-level">Level {progress.current.level} of 7</span>
            <span className="academic-rank-status">Current rank</span>
            {backendSynced && (
              <span className="academic-rank-live">
                <i aria-hidden="true" />
                Live from saved records
              </span>
            )}
          </div>
          <p className="mt-5 text-xs font-black uppercase text-[#62E5D5]">
            {progress.current.kicker}
          </p>
          <h2 id="current-rank-title">{progress.current.name}</h2>
          <p>{progress.current.description}</p>
          {primaryNextCheck && (
            <div className="academic-rank-next-task">
              <div>
                <span>Best next step</span>
                <strong>{primaryNextCheck.label}</strong>
              </div>
              <Link
                to={primaryNextCheck.destination}
                hash={primaryNextCheck.hash}
                className="academic-rank-next-task__action"
                onClick={() => {
                  replayCurrentRankTarget(primaryNextCheck.destination, primaryNextCheck.hash);
                }}
              >
                {primaryNextCheck.action} <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          )}
          <div className="academic-rank-metrics" aria-label="Current academic progress">
            <span>
              <strong>{formatCredits(progress.metrics.mappedCredits)}</strong> mapped credits
            </span>
            <span>
              <strong>{progress.metrics.mappedCourseCount}</strong> of{" "}
              {progress.metrics.courseCount} courses mapped
            </span>
            <span>
              <strong>{progress.metrics.completedRoadmapItems}</strong> roadmap actions done
            </span>
          </div>
          {progress.next ? (
            <>
              <div className="academic-rank-next">
                <div>
                  <span>Next: {progress.next.name}</span>
                  <strong>{nextPercent}%</strong>
                </div>
                <div
                  className="academic-rank-next__track"
                  role="progressbar"
                  aria-label={`Progress to ${progress.next.name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={nextPercent}
                >
                  <span style={{ width: `${nextPercent}%` }} />
                </div>
              </div>
            </>
          ) : (
            <p className="academic-rank-complete-message">
              Every current Scholaport rank is earned. Keep your records and packet current.
            </p>
          )}
        </div>
        <div className="academic-rank-hero__asset">
          <span className="academic-rank-hero__halo" aria-hidden="true" />
          <img src={rankAssets[progress.current.id]} alt="" />
        </div>
      </section>

      <section className="academic-rank-section" aria-labelledby="rank-route-title">
        <div className="academic-rank-section__heading">
          <div>
            <p className="journey-eyebrow">Rank route</p>
            <h2 id="rank-route-title">Each rank follows real work.</h2>
          </div>
          <p>
            Rank progress is calculated from your saved Scholaport records. It never replaces a
            school or counselor decision.
          </p>
        </div>

        <ol className="academic-rank-route">
          <RouteTrack
            className="academic-rank-route__track academic-rank-route__track--desktop"
            path={desktopRoutePath}
            viewBox="0 0 1000 1800"
            progress={routeProgress}
          />
          <RouteTrack
            className="academic-rank-route__track academic-rank-route__track--mobile"
            path={mobileRoutePath}
            viewBox="0 0 390 2020"
            progress={routeProgress}
          />
          {progress.ranks.map((rank, index) => {
            const position = routePositions[index];
            const state =
              index < currentIndex
                ? "earned"
                : index === currentIndex
                  ? "current"
                  : index === currentIndex + 1
                    ? "next"
                    : "locked";
            const showChecks = state === "next";
            const firstIncompleteCheck = rank.checks.find((check) => !check.complete);
            return (
              <li
                key={rank.id}
                style={
                  {
                    "--route-x": position.x,
                    "--route-y": position.y,
                    "--route-mobile-x": position.mobileX,
                    "--route-mobile-y": position.mobileY,
                  } as CSSProperties
                }
                className={cn(
                  "academic-rank-step",
                  `academic-rank-step--detail-${position.side}`,
                  `academic-rank-step--${state}`,
                )}
              >
                <div className="academic-rank-step__node" aria-hidden="true">
                  <span>{rank.level}</span>
                  <img src={rankAssets[rank.id]} alt="" />
                  {state === "earned" && <Check className="academic-rank-step__check" />}
                  {state === "locked" && <LockKeyhole className="academic-rank-step__lock" />}
                </div>
                <div className="academic-rank-step__detail">
                  <div className="flex items-center gap-2">
                    <span
                      className={`academic-rank-step__state academic-rank-step__state--${state}`}
                    >
                      {rankStateLabel(state)}
                    </span>
                    <span className="text-[10px] font-black text-[#8790A2]">
                      Level {rank.level}
                    </span>
                  </div>
                  <h3>{rank.name}</h3>
                  <p>{rank.description}</p>
                  {showChecks && (
                    <ul className="academic-rank-checks">
                      {rank.checks.map((check) => {
                        const content = (
                          <>
                            <span className="academic-rank-checks__status">
                              {check.complete ? <Check /> : null}
                            </span>
                            <div>
                              {check.label}
                              {check.value && <small>{check.value}</small>}
                              {!check.complete && (
                                <small className="academic-rank-checks__action-label">
                                  {check.action}
                                </small>
                              )}
                            </div>
                            {!check.complete && (
                              <ArrowRight
                                className="academic-rank-checks__arrow"
                                aria-hidden="true"
                              />
                            )}
                          </>
                        );
                        return (
                          <li
                            key={check.id}
                            className={check.complete ? "is-complete" : "is-actionable"}
                          >
                            {check.complete ? (
                              <div className="academic-rank-checks__row">{content}</div>
                            ) : (
                              <Link
                                to={check.destination}
                                hash={check.hash}
                                className="academic-rank-checks__row academic-rank-checks__link"
                                aria-label={`${check.action}: ${check.label}`}
                                onClick={() => {
                                  replayCurrentRankTarget(check.destination, check.hash);
                                }}
                              >
                                {content}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {state === "next" && (
                    <Link
                      to={firstIncompleteCheck?.destination ?? rank.destination}
                      hash={firstIncompleteCheck?.hash ?? rank.hash}
                      className="academic-rank-step__action"
                      onClick={() => {
                        const destination = firstIncompleteCheck?.destination ?? rank.destination;
                        const hash = firstIncompleteCheck?.hash ?? rank.hash;
                        replayCurrentRankTarget(destination, hash);
                      }}
                    >
                      {firstIncompleteCheck?.action ?? rank.action} <ArrowRight />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}

function replayCurrentRankTarget(destination: string, hash?: string) {
  if (!hash || typeof window === "undefined" || window.location.pathname !== destination) return;
  const currentHash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (currentHash === decodeURIComponent(hash.replace(/^#/, ""))) {
    scheduleRankTaskFocus(hash);
  }
}

function RouteTrack({
  className,
  path,
  viewBox,
  progress,
}: {
  className: string;
  path: string;
  viewBox: string;
  progress: number;
}) {
  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
      <path className="academic-rank-route__shadow" d={path} pathLength="1" />
      <path className="academic-rank-route__base" d={path} pathLength="1" />
      <path
        className="academic-rank-route__progress"
        d={path}
        pathLength="1"
        style={{ strokeDasharray: `${routeProgressFloor(progress)} 1` }}
      />
      <path
        className="academic-rank-route__highlight"
        d={path}
        pathLength="1"
        style={{ strokeDasharray: `${routeProgressFloor(progress)} 1` }}
      />
    </svg>
  );
}

function rankStateLabel(state: "earned" | "current" | "next" | "locked") {
  if (state === "earned") return "Earned";
  if (state === "current") return "Current rank";
  if (state === "next") return "Up next";
  return "Locked";
}

function formatCredits(value: number) {
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function routeProgressFloor(progress: number) {
  return Math.max(0.001, progress);
}
