import { Button } from "@/components/ui/button"

interface HeroSupernovaProps {
  eyebrow?: string
  title: string
  description: string
  primaryAction: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
}

export function HeroSupernova({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: HeroSupernovaProps) {
  return (
    <section className="border-b">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
        {eyebrow ? (
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="text-4xl font-semibold text-balance sm:text-5xl">
          {title}
        </h1>

        <p className="text-muted-foreground max-w-xl text-lg text-pretty">
          {description}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={primaryAction.href}>{primaryAction.label}</a>
          </Button>

          {secondaryAction ? (
            <Button asChild size="lg" variant="outline">
              <a href={secondaryAction.href}>{secondaryAction.label}</a>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
