import { Check, ChevronLeft, ChevronRight, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PoriAvatar } from "@/components/pori/PoriAvatar";
import {
  DEFAULT_PORI_PREFERENCES,
  DEFAULT_PORI_LAYER_TRANSFORM,
  PORI_BASE_ASSETS,
  PORI_BUILDER_STEPS,
  PORI_DETAIL_ASSETS,
  PORI_EXPRESSION_ASSETS,
  PORI_HEAD_ASSETS,
  PORI_SECONDARY_ASSETS,
  completePoriStep,
  getPoriCompatibilityIssue,
  rollbackPoriPreferences,
  type PoriAssetDefinition,
  type PoriBuilderStep,
  type PoriLayerTransform,
  type PoriPreferences,
} from "@/lib/pori";
import { cn } from "@/lib/utils";

const stepCopy: Record<PoriBuilderStep, { label: string; title: string; detail: string }> = {
  base: {
    label: "Base",
    title: "Choose Pori's base style",
    detail: "Every option keeps Pori's official colors and shape.",
  },
  expression: {
    label: "Expression",
    title: "Choose an expression",
    detail: "Pick the expression that feels most like your companion.",
  },
  head: {
    label: "Head",
    title: "Add a head accessory",
    detail: "Choose one accessory or keep Pori classic.",
  },
  secondary: {
    label: "Accessory",
    title: "Add one accessory",
    detail: "Curated items from the ScholaPort academic journey.",
  },
  detail: {
    label: "Detail",
    title: "Choose a companion detail",
    detail: "A small object that connects Pori to your route.",
  },
  review: {
    label: "Review",
    title: "Review your Pori",
    detail: "Your companion will appear in your Passport and selected guidance moments.",
  },
};

function Option({
  asset,
  selected,
  disabled,
  reason,
  onSelect,
}: {
  asset: PoriAssetDefinition;
  selected: boolean;
  disabled?: boolean;
  reason?: string | null;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className="pori-option"
      aria-pressed={selected}
      disabled={disabled}
      title={reason ?? asset.name}
      onClick={onSelect}
    >
      <span className="pori-option__image">
        <img src={asset.thumbnailPath} alt="" />
      </span>
      <strong>{asset.name}</strong>
      {selected && <Check aria-hidden="true" />}
      {disabled && reason && <small>{reason}</small>}
    </button>
  );
}

function NoneOption({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      className="pori-option pori-option--none"
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="pori-option__image">
        <span>None</span>
      </span>
      <strong>No accessory</strong>
      {selected && <Check aria-hidden="true" />}
    </button>
  );
}

function FitControls({
  asset,
  value,
  onChange,
}: {
  asset: PoriAssetDefinition;
  value: PoriLayerTransform;
  onChange: (next: PoriLayerTransform) => void;
}) {
  const update = (key: keyof PoriLayerTransform, next: number) =>
    onChange({ ...value, [key]: next });

  return (
    <section className="pori-fit" aria-label={`Fine tune ${asset.name}`}>
      <div className="pori-fit__heading">
        <span>
          <SlidersHorizontal aria-hidden="true" />
        </span>
        <div>
          <h2>Fine-tune the fit</h2>
          <p>Attached to Pori's {asset.attachment} zone. Adjustments stay inside a safe range.</p>
        </div>
        <button type="button" onClick={() => onChange({ ...DEFAULT_PORI_LAYER_TRANSFORM })}>
          Reset fit
        </button>
      </div>
      <div className="pori-fit__controls">
        <label>
          <span>Left / right</span>
          <input
            type="range"
            min={asset.adjustment.x[0]}
            max={asset.adjustment.x[1]}
            step="0.5"
            value={value.x}
            onChange={(event) => update("x", Number(event.target.value))}
          />
          <output>{value.x > 0 ? `+${value.x}` : value.x}</output>
        </label>
        <label>
          <span>Up / down</span>
          <input
            type="range"
            min={asset.adjustment.y[0]}
            max={asset.adjustment.y[1]}
            step="0.5"
            value={value.y}
            onChange={(event) => update("y", Number(event.target.value))}
          />
          <output>{value.y > 0 ? `+${value.y}` : value.y}</output>
        </label>
        <label>
          <span>Size</span>
          <input
            type="range"
            min={asset.adjustment.scale[0]}
            max={asset.adjustment.scale[1]}
            step="0.01"
            value={value.scale}
            onChange={(event) => update("scale", Number(event.target.value))}
          />
          <output>{Math.round(value.scale * 100)}%</output>
        </label>
        <label>
          <span>Angle</span>
          <input
            type="range"
            min={asset.adjustment.rotation[0]}
            max={asset.adjustment.rotation[1]}
            step="1"
            value={value.rotation}
            onChange={(event) => update("rotation", Number(event.target.value))}
          />
          <output>{value.rotation}°</output>
        </label>
      </div>
    </section>
  );
}

export function PoriBuilder({
  preferences,
  onChange,
  onFinish,
  onReset,
}: {
  preferences: PoriPreferences;
  onChange: (next: PoriPreferences) => void | Promise<unknown>;
  onFinish?: () => void;
  onReset?: () => void;
}) {
  const initial = Math.max(0, PORI_BUILDER_STEPS.indexOf(preferences.firstIncompleteStep));
  const [stepIndex, setStepIndex] = useState(preferences.status === "complete" ? 5 : initial);
  const step = PORI_BUILDER_STEPS[stepIndex];
  const copy = stepCopy[step];

  useEffect(() => {
    const resumeAt = Math.max(0, PORI_BUILDER_STEPS.indexOf(preferences.firstIncompleteStep));
    setStepIndex(preferences.status === "complete" ? 5 : resumeAt);
  }, [preferences.firstIncompleteStep, preferences.status]);

  const options = useMemo(() => {
    if (step === "base") return PORI_BASE_ASSETS;
    if (step === "expression") return PORI_EXPRESSION_ASSETS;
    if (step === "head") return PORI_HEAD_ASSETS;
    if (step === "secondary") return PORI_SECONDARY_ASSETS;
    if (step === "detail") return PORI_DETAIL_ASSETS;
    return [];
  }, [step]);

  const select = (asset: PoriAssetDefinition) => {
    const now = new Date().toISOString();
    if (step === "base")
      void onChange({
        ...preferences,
        baseStyle: asset.id as PoriPreferences["baseStyle"],
        status: "in-progress",
        updatedAt: now,
      });
    if (step === "expression")
      void onChange({
        ...preferences,
        expression: asset.id as PoriPreferences["expression"],
        status: "in-progress",
        updatedAt: now,
      });
    if (step === "head")
      void onChange({
        ...preferences,
        headAccessory: asset.id as PoriPreferences["headAccessory"],
        transforms: {
          ...preferences.transforms,
          head: { ...DEFAULT_PORI_LAYER_TRANSFORM },
        },
        status: "in-progress",
        updatedAt: now,
      });
    if (step === "secondary")
      void onChange({
        ...preferences,
        secondaryAccessory: asset.id as PoriPreferences["secondaryAccessory"],
        transforms: {
          ...preferences.transforms,
          secondary: { ...DEFAULT_PORI_LAYER_TRANSFORM },
        },
        status: "in-progress",
        updatedAt: now,
      });
    if (step === "detail")
      void onChange({
        ...preferences,
        companionDetail: asset.id as PoriPreferences["companionDetail"],
        transforms: {
          ...preferences.transforms,
          detail: { ...DEFAULT_PORI_LAYER_TRANSFORM },
        },
        status: "in-progress",
        updatedAt: now,
      });
  };

  const chooseNone = () => {
    const now = new Date().toISOString();
    if (step === "head")
      void onChange({ ...preferences, headAccessory: null, status: "in-progress", updatedAt: now });
    if (step === "secondary")
      void onChange({
        ...preferences,
        secondaryAccessory: null,
        status: "in-progress",
        updatedAt: now,
      });
    if (step === "detail")
      void onChange({
        ...preferences,
        companionDetail: null,
        status: "in-progress",
        updatedAt: now,
      });
  };

  const continueFlow = async () => {
    const next = completePoriStep(preferences, step);
    await onChange(next);
    if (step === "review") return onFinish?.();
    setStepIndex(Math.min(stepIndex + 1, PORI_BUILDER_STEPS.length - 1));
  };

  const goBackTo = async (targetIndex: number) => {
    const targetStep = PORI_BUILDER_STEPS[targetIndex];
    if (!targetStep || targetIndex >= stepIndex) return;
    await onChange(rollbackPoriPreferences(preferences, targetStep));
    setStepIndex(targetIndex);
  };

  const selectedId =
    step === "base"
      ? preferences.baseStyle
      : step === "expression"
        ? preferences.expression
        : step === "head"
          ? preferences.headAccessory
          : step === "secondary"
            ? preferences.secondaryAccessory
            : step === "detail"
              ? preferences.companionDetail
              : null;
  const optional = step === "head" || step === "secondary" || step === "detail";
  const adjustableSlot = step === "secondary" || step === "detail" ? step : null;
  const selectedAsset = selectedId ? options.find((asset) => asset.id === selectedId) : undefined;

  const updateTransform = (next: PoriLayerTransform) => {
    if (!adjustableSlot) return;
    void onChange({
      ...preferences,
      transforms: { ...preferences.transforms, [adjustableSlot]: next },
      status: "in-progress",
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <section className="pori-builder">
      <nav className="pori-builder__steps" aria-label="Pori customization progress">
        {PORI_BUILDER_STEPS.map((item, index) => {
          const available = index <= stepIndex;
          return (
            <button
              key={item}
              type="button"
              disabled={!available}
              aria-current={item === step ? "step" : undefined}
              onClick={() => void goBackTo(index)}
            >
              <span>{preferences.completedSteps.includes(item) ? <Check /> : index + 1}</span>
              <strong>{stepCopy[item].label}</strong>
            </button>
          );
        })}
      </nav>

      <div className="pori-builder__workspace">
        <aside className="pori-builder__preview">
          <PoriAvatar preferences={preferences} />
          <p>Your Pori preview</p>
        </aside>
        <div className="pori-builder__choices">
          <p className="journey-eyebrow">Step {stepIndex + 1} of 6</p>
          <h1>{copy.title}</h1>
          <p>{copy.detail}</p>
          {step === "review" ? (
            <div className="pori-review">
              <PoriAvatar preferences={preferences} context="mobile" />
              <dl>
                <div>
                  <dt>Base</dt>
                  <dd>{preferences.baseStyle}</dd>
                </div>
                <div>
                  <dt>Expression</dt>
                  <dd>{preferences.expression}</dd>
                </div>
                <div>
                  <dt>Head</dt>
                  <dd>{preferences.headAccessory ?? "None"}</dd>
                </div>
                <div>
                  <dt>Accessory</dt>
                  <dd>{preferences.secondaryAccessory ?? "None"}</dd>
                </div>
                <div>
                  <dt>Detail</dt>
                  <dd>{preferences.companionDetail ?? "None"}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className={cn("pori-builder__grid", `pori-builder__grid--${step}`)}>
              {optional && <NoneOption selected={selectedId === null} onSelect={chooseNone} />}
              {step === "expression" && (
                <button
                  type="button"
                  className="pori-option"
                  aria-pressed={preferences.expression === "friendly"}
                  onClick={() =>
                    void onChange({
                      ...preferences,
                      expression: "friendly",
                      status: "in-progress",
                      updatedAt: new Date().toISOString(),
                    })
                  }
                >
                  <span className="pori-option__image">
                    <PoriAvatar
                      preferences={{
                        ...preferences,
                        expression: "friendly",
                        headAccessory: null,
                        secondaryAccessory: null,
                        companionDetail: null,
                      }}
                      context="mobile"
                    />
                  </span>
                  <strong>Friendly</strong>
                  {preferences.expression === "friendly" && <Check />}
                </button>
              )}
              {options.map((asset) => {
                const category =
                  step === "secondary" ? "secondary" : step === "detail" ? "detail" : null;
                const reason = category
                  ? getPoriCompatibilityIssue(preferences, category, asset.id)
                  : null;
                return (
                  <Option
                    key={asset.id}
                    asset={asset}
                    selected={selectedId === asset.id}
                    disabled={Boolean(reason)}
                    reason={reason}
                    onSelect={() => select(asset)}
                  />
                );
              })}
            </div>
          )}
          {adjustableSlot && selectedAsset && (
            <FitControls
              asset={selectedAsset}
              value={preferences.transforms[adjustableSlot]}
              onChange={updateTransform}
            />
          )}
          <div className="pori-builder__actions">
            <button
              type="button"
              className="pori-builder__back"
              disabled={stepIndex === 0}
              onClick={() => void goBackTo(stepIndex - 1)}
            >
              <ChevronLeft /> Back
            </button>
            {onReset && (
              <button type="button" className="pori-builder__reset" onClick={onReset}>
                <RotateCcw /> Reset
              </button>
            )}
            <button
              type="button"
              className="pori-builder__continue"
              onClick={() => void continueFlow()}
            >
              {step === "review" ? "Save my Pori" : "Continue"}
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
