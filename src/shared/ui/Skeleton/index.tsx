import { Skeleton as BaseSkeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export { BaseSkeleton as Skeleton }

export function CardSkeleton() {
  return (
    <div className="bg-white rounded border border-gray-200 p-5">
      <BaseSkeleton className="h-5 w-2/5 mb-4" />
      <BaseSkeleton className="h-4 w-3/5 mb-2" />
      <BaseSkeleton className="h-4 w-2/5 mb-5" />
      <BaseSkeleton className="h-8 w-28" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <BaseSkeleton className={cn('h-4', i === 0 ? 'w-8' : i % 3 === 0 ? 'w-3/5' : 'w-4/5')} />
        </td>
      ))}
    </tr>
  )
}
