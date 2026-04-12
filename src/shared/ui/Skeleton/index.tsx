import { cn } from '@/shared/lib/cn'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 rounded animate-pulse',
        className,
      )}
      style={style}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <Skeleton className="h-5 w-2/5 mb-4" />
      <Skeleton className="h-4 w-3/5 mb-2" />
      <Skeleton className="h-4 w-2/5 mb-5" />
      <Skeleton className="h-8 w-28" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4" style={{ width: `${60 + (i % 3) * 15}%` }} />
        </td>
      ))}
    </tr>
  )
}
