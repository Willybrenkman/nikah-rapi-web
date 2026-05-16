const widths = ['w-3/4', 'w-full', 'w-2/3', 'w-5/6', 'w-1/2', 'w-4/5']

function SkeletonCell({ i, j, cols }) {
    const w = j === 0 ? 'w-6' : j === cols - 1 ? 'w-14' : widths[(i + j) % widths.length]
    return (
        <td className="td">
            <div className={`h-3 rounded-full bg-ivory animate-shimmer ${w}`} style={{ animationDelay: `${(i * cols + j) * 40}ms` }} />
        </td>
    )
}

export default function TableSkeleton({ cols = 6, rows = 5 }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="tr">
                    {Array.from({ length: cols }).map((_, j) => (
                        <SkeletonCell key={j} i={i} j={j} cols={cols} />
                    ))}
                </tr>
            ))}
        </>
    )
}
