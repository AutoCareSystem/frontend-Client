type Props = {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
};

export default function SimpleBarChart({ data, labels = [], height = 80, color = '#ef4444' }: Props) {
  const max = Math.max(...data, 1);
  const width = 300;
  const barWidth = Math.max(6, Math.floor((width - data.length * 6) / data.length));

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((d, i) => {
        const x = i * (barWidth + 6) + 6;
        const h = (d / max) * (height - 20);
        const y = height - h - 12;
        return (
          <g key={i}>
            <rect x={x} y={height - 12} width={barWidth} height={0} rx={3} fill={color} opacity={0.95}>
              <animate attributeName="y" from={height - 12} to={y} dur="700ms" fill="freeze" />
              <animate attributeName="height" from="0" to={String(h)} dur="700ms" fill="freeze" />
            </rect>
            {labels[i] ? (
              <text x={x + barWidth / 2} y={height - 2} fontSize={10} fill="#9ca3af" textAnchor="middle">{labels[i]}</text>
            ) : null}
            <title>{d}</title>
          </g>
        );
      })}
    </svg>
  );
}
