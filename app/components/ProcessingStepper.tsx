'use client';

/**
 * ProcessingStepper.tsx
 * Transparent 4-step progress & trust-building stepper component.
 * Displays real-time inspection stages to reassure users that their
 * photo is being processed locally and securely.
 * Full Dark Mode & Mobile Responsive.
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
  customStep3Label = 'Stripping Metadata',
  customStep3Desc = 'Removing targeted tags & preserving visual pixels',
  fileName,
}: ProcessingStepperProps) {
  const steps: StepItem[] = [
    {
      id: 1,
      label: 'Reading File',
      description: 'Loading binary bytes into local browser memory',
    },
    {
      id: 2,
      label: 'Analyzing Tags',
      description: 'Scanning EXIF, GPS coordinates & header chunks',
    },
    {
      id: 3,
      label: customStep3Label,
      description: customStep3Desc,
    },
    {
      id: 4,
      label: 'Finalizing',
      description: 'Verifying clean image output & preparing download',
    },
  ];

  return (
    <div className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-900/60 shadow-2xs animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Live In-Browser Processing
            </span>
          </div>
          {fileName && (
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 truncate max-w-sm">
              Analyzing: <span className="font-semibold text-slate-800 dark:text-slate-200">{fileName}</span>
            </p>
          )}
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs font-bold text-slate-900 dark:text-white">{progressPercent}% Completed</span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">100% Client-Side · Zero Server Uploads</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-200/90 dark:bg-slate-800 rounded-full overflow-hidden mb-6 p-0.5">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 rounded-full transition-all duration-300 ease-out shadow-xs"
          style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
        />
      </div>

      {/* 4-Step Stepper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
                  : isCurrent
                  ? 'bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-600 shadow-sm ring-2 ring-indigo-100 dark:ring-indigo-950 text-slate-900 dark:text-white'
                  : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 text-slate-400 dark:text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isDone
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : step.id}
                </div>
                <span
                  className={`text-xs font-bold truncate ${
                    isDone
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : isCurrent
                      ? 'text-indigo-900 dark:text-indigo-300'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              <p
                className={`text-[11px] leading-tight ${
                  isDone
                    ? 'text-emerald-700/80 dark:text-emerald-400/80'
                    : isCurrent
                    ? 'text-slate-600 dark:text-slate-300'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Transparent Security Guarantee Pill */}
      <div className="mt-4 pt-3.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <svg
            width="14"
            height="14"
            className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Sandbox Guarantee: File stays strictly inside your device&apos;s RAM memory.
        </span>
        <span className="font-mono text-slate-400 dark:text-slate-500">Step {currentStep} of 4</span>
      </div>
    </div>
  );
}
