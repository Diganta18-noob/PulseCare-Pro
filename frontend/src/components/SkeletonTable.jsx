export function SkeletonTable({ columns = 5, rows = 6 }) {
    return (
        <div className="animate-fade-in rounded-xl overflow-hidden border border-white/[0.06]">
            {/* Header */}
            <div className="grid gap-4 p-4 bg-white/[0.03] border-b border-white/[0.06]"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="skeleton h-4 rounded" />
                ))}
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="grid gap-4 p-4 border-b border-white/[0.04]"
                    style={{
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        animationDelay: `${rowIndex * 100}ms`,
                    }}
                >
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="skeleton h-4 rounded"
                            style={{
                                width: colIndex === 0 ? '70%' : colIndex === columns - 1 ? '50%' : '85%',
                                animationDelay: `${(rowIndex * columns + colIndex) * 50}ms`,
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
