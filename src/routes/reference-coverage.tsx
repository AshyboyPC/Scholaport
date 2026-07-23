import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { PassportShell, StatusPill } from "@/components/PassportShell";
import { PremiumDatabaseIcon, PremiumShieldIcon } from "@/components/icons/PremiumIcon";
import { ClayScene, JourneyStage } from "@/components/journey/JourneyVisuals";
import { getReferenceCoverage } from "@/lib/reference-api";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/reference-coverage")({
  head: () => ({ meta: [{ title: "Reference Coverage · Scholaport" }] }),
  component: ReferenceCoveragePage,
});

function ReferenceCoveragePage() {
  const { t } = useI18n();
  const coverage = useQuery({ queryKey: ["reference-coverage"], queryFn: getReferenceCoverage });
  return (
    <PassportShell>
      <JourneyStage
        tone="navy"
        eyebrow={t("Evidence library")}
        title="Coverage is visible only when the source trail is visible."
        description="The inventory below reports real imported records. Empty counts stay empty instead of being filled with inferred education claims."
        action={
          <StatusPill tone="navy">
            <PremiumDatabaseIcon className="mr-1 h-3 w-3" /> Internal view
          </StatusPill>
        }
        art={
          <ClayScene
            asset="reference-library"
            eager
            orbit={false}
            mode="inline"
            className="max-w-[360px]"
          />
        }
        layout="compact"
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <StatusPill tone="mint">{coverage.data?.length ?? 0} country rows</StatusPill>
          <StatusPill tone="yellow">
            {(coverage.data ?? []).reduce((sum, row) => sum + row.dataSources, 0)} sources
          </StatusPill>
        </div>
      </JourneyStage>
      <section className="reference-coverage-table mt-5 overflow-hidden border border-[#CDD3DE]/70 bg-white shadow-card">
        <div className="reference-coverage-table__intro">
          <div>
            <p className="journey-eyebrow">{t("Reference coverage")}</p>
            <h2>{t("Imported evidence by country")}</h2>
          </div>
          <p>{t("Counts reflect stored records, not estimated education coverage.")}</p>
        </div>
        {coverage.isLoading && <State text={t("Loading reference coverage…")} />}
        {coverage.error && (
          <State
            error
            text={
              coverage.error instanceof Error
                ? coverage.error.message
                : "Unable to load reference coverage."
            }
          />
        )}
        {coverage.data && (
          <div className="overflow-x-auto">
            <table className="min-w-[1040px] w-full text-left">
              <caption className="sr-only">{t("Reference coverage")}</caption>
              <thead className="bg-[#0A175A] text-[10px] uppercase tracking-[0.12em] text-white/72">
                <tr>
                  <Header sticky>{t("Country")}</Header>
                  <Header>{t("MVP visibility")}</Header>
                  <Header>{t("Priority")}</Header>
                  <Header>{t("Jurisdictions")}</Header>
                  <Header>{t("Curricula")}</Header>
                  <Header>{t("Courses")}</Header>
                  <Header>{t("Frameworks")}</Header>
                  <Header>{t("Requirements")}</Header>
                  <Header>{t("Programs")}</Header>
                  <Header>{t("Sources")}</Header>
                  <Header>{t("Coverage")}</Header>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EBF0]">
                {coverage.data.map((row) => (
                  <tr
                    key={row.country.id}
                    className="group text-xs odd:bg-[#FAFCFB] hover:bg-[#EAF8F5]"
                  >
                    <Cell sticky>
                      <span className="reference-country-code">{row.country.iso2}</span>
                      <span className="font-bold">{row.country.name}</span>
                      <span className="ml-2 text-[10px] text-[#9AA3B2]">{row.country.iso3}</span>
                    </Cell>
                    <Cell>
                      <Visibility value={row.mvpVisibility} />
                    </Cell>
                    <Cell>
                      {row.country.is_source_priority && (
                        <Tag>S{row.country.priority_rank_source}</Tag>
                      )}{" "}
                      {row.country.is_destination_priority && (
                        <Tag>D{row.country.priority_rank_destination}</Tag>
                      )}
                    </Cell>
                    <NumberCell value={row.jurisdictions} />
                    <NumberCell value={row.curricula} />
                    <NumberCell value={row.curriculumCourses} />
                    <NumberCell value={row.frameworks} />
                    <NumberCell value={row.requirements} />
                    <NumberCell value={row.programs} />
                    <NumberCell value={row.dataSources} />
                    <Cell>
                      <Coverage status={row.country.coverage_status} />
                    </Cell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="mt-5 flex gap-3 rounded-[20px] border border-[#01C3AD]/25 bg-[#01C3AD]/[0.06] p-5">
        <PremiumShieldIcon className="h-5 w-5 shrink-0 text-[#019A8A]" />
        <div>
          <h2 className="text-sm font-bold">Coverage labels are evidence labels</h2>
          <p className="mt-1 text-xs leading-5 text-[#5A6380]">
            Only sourced records should advance to verified or official. Country seed rows establish
            routing coverage but contain no invented education-system claims.
          </p>
        </div>
        <ExternalLink className="ml-auto h-4 w-4 text-[#9AA3B2]" />
      </section>
    </PassportShell>
  );
}

function Header({ children, sticky = false }: { children: React.ReactNode; sticky?: boolean }) {
  return (
    <th
      scope="col"
      className={`px-4 py-4 font-bold ${sticky ? "sticky left-0 z-20 bg-[#0A175A]" : ""}`}
    >
      {children}
    </th>
  );
}
function Cell({ children, sticky = false }: { children: React.ReactNode; sticky?: boolean }) {
  return (
    <td
      className={`px-4 py-4 ${sticky ? "sticky left-0 z-10 min-w-[190px] bg-inherit shadow-[8px_0_16px_-16px_#07113f]" : ""}`}
    >
      {children}
    </td>
  );
}
function NumberCell({ value }: { value: number }) {
  return (
    <Cell>
      <span className={value ? "font-black text-[#0A175A]" : "text-[#CDD3DE]"}>{value}</span>
    </Cell>
  );
}
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#0A175A]/8 px-2 py-1 text-[9px] font-black text-[#0A175A]">
      {children}
    </span>
  );
}
function Coverage({ status }: { status: string }) {
  const sourced = status === "official" || status === "verified";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${sourced ? "bg-[#01C3AD]/10 text-[#019A8A]" : status === "needs_research" || status === "country_seed_only" ? "bg-[#F86746]/10 text-[#E65234]" : "bg-[#0A175A]/8 text-[#5A6380]"}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
function Visibility({ value }: { value: "source" | "destination" | "hidden" }) {
  const label = value === "hidden" ? "Verified/seeded, hidden" : `MVP 1 ${value}`;
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${value === "hidden" ? "bg-[#0A175A]/8 text-[#5A6380]" : "bg-[#01C3AD]/10 text-[#019A8A]"}`}
    >
      {label}
    </span>
  );
}
function State({ text, error = false }: { text: string; error?: boolean }) {
  return (
    <div className={`p-10 text-center text-sm ${error ? "text-[#E65234]" : "text-[#5A6380]"}`}>
      {text}
    </div>
  );
}
