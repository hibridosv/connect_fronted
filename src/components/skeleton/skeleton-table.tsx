import React from 'react'

interface SkeletonTableProps {
  columns?: number
  rows?: number
}

export default function SkeletonTable({ columns = 7, rows = 11 }: SkeletonTableProps) {
  return (
    <div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-text-muted">
      <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
        <tr>
        {Array.from({ length: columns }).map((_, index) => (
              <th scope="col"  key={`header-${index}`} className="py-2 px-2 border-r border-bg-subtle">
                <div className="h-5 bg-bg-subtle rounded animate-pulse"></div>
              </th>
            ))}

        </tr>
      </thead>
      <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`} className='bg-bg-content odd:bg-bg-subtle/40 border-b border-bg-subtle'>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td className="py-2 px-2" key={colIndex}>
                  <div className="h-6 bg-bg-subtle rounded animate-pulse text-lg"></div>
                  </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
 </div>
 </div>
  )
}
