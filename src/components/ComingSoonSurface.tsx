import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PassportShell, StatusPill } from "@/components/PassportShell";
import {
  PremiumClockIcon,
  PremiumLockIcon,
  PremiumShieldIcon,
} from "@/components/icons/PremiumIcon";
import { ClayScene, JourneyStage, type ClayAssetName } from "@/components/journey/JourneyVisuals";
import { useI18n } from "@/lib/i18n";
import type { ReactNode } from "react";

type ComingSoonSurfaceProps = {
  eyebrow: string;
  title: string;
  description: string;
  stageTitle: string;
  stageDescription: string;
  lockedReason: string;
  readyAfter: string[];
  asset?: ClayAssetName;
  companion?: ReactNode;
};

export function ComingSoonSurface({
  eyebrow,
  title,
  description,
  stageTitle,
  stageDescription,
  lockedReason,
  readyAfter,
  asset = "counselor-guidance",
  companion,
}: ComingSoonSurfaceProps) {
  const { t } = useI18n();
  return (
    <PassportShell>
      <JourneyStage
        tone="coral"
        eyebrow={t(eyebrow)}
        title={t(stageTitle)}
        description={t(stageDescription || description || title)}
        art={companion ?? <ClayScene asset={asset} eager className="coming-soon-clay-scene" />}
        layout="wide"
      >
        <div className="mt-6">
          <StatusPill tone="coral">
            <PremiumClockIcon className="mr-1 h-3 w-3" /> {t("Coming soon")}
          </StatusPill>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {readyAfter.map((item) => (
              <div
                key={item}
                className="rounded-[20px] bg-white/70 p-4 shadow-[inset_0_1px_rgba(255,255,255,.8)]"
              >
                <PremiumShieldIcon className="h-4 w-4 text-[#0A175A]" />
                <p className="mt-2 text-xs font-bold text-[#0A175A]">{t(item)}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/transcript"
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#0A175A] px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,23,90,.16)]"
            >
              {t("Continue transcript workflow")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/roadmap"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/80 bg-white/75 px-4 text-sm font-bold text-[#0A175A]"
            >
              {t("View roadmap")}
            </Link>
          </div>
        </div>
        <aside className="mt-5 rounded-[20px] bg-white/62 p-5">
          <PremiumLockIcon className="h-6 w-6 text-[#E65234]" />
          <h3 className="mt-3 text-sm font-black text-[#0A175A]">{t("Why it is locked")}</h3>
          <p className="mt-2 text-xs leading-5 text-[#5A6380]">{t(lockedReason)}</p>
        </aside>
      </JourneyStage>
    </PassportShell>
  );
}
