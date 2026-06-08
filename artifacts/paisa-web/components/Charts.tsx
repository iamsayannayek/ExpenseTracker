import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Polyline, Text as SvgText } from 'react-native-svg';
import { useAppColors } from '@/hooks/useAppColors';

// --- Donut/Pie Chart ---
interface PieSlice { name: string; value: number; color: string; }

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function arcPath(cx: number, cy: number, r: number, innerR: number, startAngle: number, endAngle: number): string {
  const s = polarToCartesian(cx, cy, r, endAngle);
  const e = polarToCartesian(cx, cy, r, startAngle);
  const si = polarToCartesian(cx, cy, innerR, endAngle);
  const ei = polarToCartesian(cx, cy, innerR, startAngle);
  const large = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} L ${ei.x} ${ei.y} A ${innerR} ${innerR} 0 ${large} 1 ${si.x} ${si.y} Z`;
}

export function DonutChart({ data }: { data: PieSlice[] }) {
  const c = useAppColors();
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 65;
  const innerR = 42;
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0 || data.length === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 160 }}>
        <Text style={{ color: c.mutedForeground, fontSize: 13 }}>No expenses yet</Text>
      </View>
    );
  }

  let currentAngle = 0;
  const slices = data.map(d => {
    const sliceAngle = (d.value / total) * 360;
    const start = currentAngle;
    currentAngle += sliceAngle;
    return { ...d, start, end: currentAngle };
  });

  return (
    <View>
      <Svg width={size} height={size}>
        {slices.map((s, i) => (
          <Path key={i} d={arcPath(cx, cy, outerR, innerR, s.start, s.end)} fill={s.color} />
        ))}
        <Circle cx={cx} cy={cy} r={innerR - 2} fill={c.surface} />
      </Svg>
    </View>
  );
}

// --- Line Chart ---
interface LineDataPoint { name: string; spent: number; saved: number; }

export function SavingsLineChart({ data, filter }: { data: LineDataPoint[]; filter: 'both' | 'spent' | 'saved' }) {
  const c = useAppColors();
  const W = 280;
  const H = 180;
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const allVals: number[] = [];
  if (filter !== 'saved') data.forEach(d => allVals.push(d.spent));
  if (filter !== 'spent') data.forEach(d => allVals.push(d.saved));
  const minY = 0;
  const maxY = Math.max(...allVals, 1000);

  const scaleX = (i: number) => padL + (i / (data.length - 1)) * chartW;
  const scaleY = (v: number) => padT + chartH - ((v - minY) / (maxY - minY)) * chartH;

  const spentPoints = data.map((d, i) => `${scaleX(i)},${scaleY(d.spent)}`).join(' ');
  const savedPoints = data.map((d, i) => `${scaleX(i)},${scaleY(d.saved)}`).join(' ');

  const yTicks = [0, Math.round(maxY * 0.5), maxY];

  return (
    <Svg width={W} height={H}>
      {/* Grid lines */}
      {yTicks.map((v, i) => (
        <React.Fragment key={i}>
          <Line x1={padL} y1={scaleY(v)} x2={W - padR} y2={scaleY(v)} stroke={c.border} strokeWidth={1} />
          <SvgText x={padL - 6} y={scaleY(v) + 4} fontSize={9} fill={c.textTertiary} textAnchor="end">
            {v >= 1000 ? `${Math.round(v / 1000)}k` : v}
          </SvgText>
        </React.Fragment>
      ))}
      {/* X labels */}
      {data.map((d, i) => (
        <SvgText key={i} x={scaleX(i)} y={H - 6} fontSize={9} fill={c.textTertiary} textAnchor="middle">
          {d.name}
        </SvgText>
      ))}
      {/* Lines */}
      {(filter === 'both' || filter === 'spent') && (
        <Polyline points={spentPoints} fill="none" stroke="#f43f5e" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {(filter === 'both' || filter === 'saved') && (
        <Polyline points={savedPoints} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {/* Dots */}
      {(filter === 'both' || filter === 'spent') && data.map((d, i) => (
        <Circle key={`s${i}`} cx={scaleX(i)} cy={scaleY(d.spent)} r={3.5} fill="#f43f5e" />
      ))}
      {(filter === 'both' || filter === 'saved') && data.map((d, i) => (
        <Circle key={`v${i}`} cx={scaleX(i)} cy={scaleY(d.saved)} r={3.5} fill="#10b981" />
      ))}
    </Svg>
  );
}

// --- Simple Progress Bar ---
export function ProgressBar({ current, max, color }: { current: number; max: number; color: string }) {
  const c = useAppColors();
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  return (
    <View style={{ height: 7, backgroundColor: c.border, borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
      <View style={{ height: 7, borderRadius: 4, backgroundColor: color, width: `${pct}%` }} />
    </View>
  );
}
