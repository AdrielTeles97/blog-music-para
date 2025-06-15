interface PageHeaderProps {
  title: string
  description?: string
  centered?: boolean
  badge?: string
  className?: string
}

export function PageHeader({ title, description, centered = false, badge, className = "" }: PageHeaderProps) {
  return (
    <div className={`space-y-2 ${centered ? 'text-center' : ''} ${className}`}>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-primary/20 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>
      {description && (
        <p className="text-muted-foreground max-w-xl">
          {description}
        </p>
      )}
    </div>
  )
}
