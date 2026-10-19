'use client';

/**
 * ProcessingStepper.tsx
 * Minimalist Forensic Progress Stepper for MetaZap.
 * Provides real-time transparency and reassurance that the image is
 * processed strictly in local browser memory.
 */

export interface StepItem {
  id: number;
  label: string;
  description: string;
}

export interface ProcessingStepperProps {
  currentStep: number; // 1, 2, 3, or 4
  progressPercent: number; // 0 to 100
  customStep3Label?: string;
  customStep3Desc?: string;
  fileName?: string;
}

export default function ProcessingStepper({
  currentStep,
  progressPercent,
  customStep3Label = 'Sanitizing Headers',
  customStep3Desc = 'Purging targeted tags while preserving pixel matrix',
  fileName,
}: ProcessingStepperProps) {
  const steps: StepItem[] = [
    {
      id: 1,
      label: '01. Ingestion',
      description: 'Loading binary bytes into local RAM buffer',
    },
    {
      id: 2,
      label: '02. Inspection',
      description: 'Scanning EXIF directories & GPS tags',
    },
    {
      id: 3,
      label: `03. ${customStep3Label}`,
      description: customStep3Desc,
    },
    {
      id: 4,
      label: '04. Verification',
      description: 'Verifying zero remaining tracking markers',
    },
  ];

  return (
    <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-5 sm:p-6 bg-stone-50/70 dark:bg-stone-900/40 shadow-2xs animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-200/60 dark:border-stone-800/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-stone-100 animate-pulse"></span>
            <span className="editorial-kicker text-stone-900 dark:text-stone-100">
              Forensic Processing In Progress
            </span>
          </div>
          {fileName && (
            <p className="font-mono text-xs text-stone-600 dark:text-stone-400 mt-1 truncate max-w-sm">
              Target: <span className="text-stone-900 dark:text-stone-200 font-semibold">{fileName}</span>
            </p>
          )}
        </div>
        <div className="text-left sm:text-right font-mono">
          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
            [{progressPercent}% COMPLETED]
          </span>
          <p className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            100% Client-Side RAM Buffer
          </p>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-stone-900 dark:bg-stone-100 rounded-full transition-all duration-200 ease-out"
          style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
        />
      </div>

      {/* 4-Step Ledger Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {steps.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-lg border transition-all ${
                isDone
                  ? 'bg-stone-100/90 dark:bg-stone-800/60 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100'
                  : isCurrent
                  ? 'bg-white dark:bg-stone-900 border-stone-900 dark:border-stone-100 shadow-2xs text-stone-950 dark:text-white'
                  : 'bg-transparent border-stone-200/60 dark:border-stone-800/60 text-stone-400 dark:text-stone-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold truncate">
                  {step.label}
                </span>
                <span className="font-mono text-[10px]">
                  {isDone ? '✓' : isCurrent ? '●' : '○'}
                </span>
              </div>
              <p className="text-[11px] leading-tight font-sans text-stone-500 dark:text-stone-400">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Sandbox Assurance */}
      <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between font-mono text-[11px] text-stone-500 dark:text-stone-400">
        <span>[ SANDBOX: ZERO EXTERNAL PACKETS TRANSMITTED ]</span>
        <span>STAGE 0{currentStep} / 04</span>
      </div>
    </div>
  );
}
