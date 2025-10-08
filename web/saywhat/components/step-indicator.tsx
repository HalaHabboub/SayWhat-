import { Check } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
              step < currentStep
                ? "bg-primary border-primary text-primary-foreground"
                : step === currentStep
                  ? "border-primary text-primary"
                  : "border-muted text-muted-foreground"
            }`}
          >
            {step < currentStep ? <Check className="w-5 h-5" /> : <span className="text-sm font-medium">{step}</span>}
          </div>
          {step < totalSteps && <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
        </div>
      ))}
    </div>
  )
}
