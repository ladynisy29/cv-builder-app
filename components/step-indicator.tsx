"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  steps: { label: string; description: string }[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress steps" className="flex items-center gap-2">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={step.label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                  isCompleted
                    ? "border-accent bg-accent text-accent-foreground"
                    : isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <div className="hidden flex-col sm:flex">
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    isActive ? "text-foreground" : isCompleted ? "text-accent" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                <span className="text-xs text-muted-foreground">{step.description}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-px w-8 sm:w-12",
                  isCompleted ? "bg-accent" : "bg-border"
                )}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
