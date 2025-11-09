type Props = { data: number[]; color?: string; strokeWidth?: number; height?: number };

function buildPath(data: number[], width: number, height: number) {
  const max = Math.max(...data, 1);
  const step = width / Math.max(1, data.length - 1);
  return data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - (v / max) * height}`).join(' ');
}

export default function SimpleLineChart({ data, color = '#ef4444', strokeWidth = 2, height = 40 }: Props) {
  const width = 140;
  const path = buildPath(data, width, height);
  const last = data[data.length - 1] ?? 0;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <style>{`
        .spark-path { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: draw 900ms ease-out forwards; }
        @keyframes draw { to { stroke-dashoffset: 0; } }
      `}</style>
      <path className="spark-path" d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* subtle area */}
      <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="url(#spark)" opacity={0.9} />
      <text x={width - 2} y={12} fontSize={11} fill="#9ca3af" textAnchor="end">{last}</text>
    </svg>
  );
}
