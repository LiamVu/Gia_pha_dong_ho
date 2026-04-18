import { memo } from "react";

const STROKE = "currentColor";

function birdRing() {
  const birds = 18;
  const r = 215;
  const items = [];
  for (let i = 0; i < birds; i++) {
    const ang = (i * 360) / birds;
    items.push(
      <g key={i} transform={`rotate(${ang}) translate(0 ${-r})`}>
        <path
          d="M -10 0 Q -4 -4 4 -2 Q 10 0 14 -4 M 4 -2 L 12 -6 M -10 0 L -18 -2 L -22 -8 M -8 0 L -6 6 L -10 10 M -2 0 L 0 8 L -2 12"
          fill="none"
          stroke={STROKE}
          strokeWidth={0.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>,
    );
  }
  return <g>{items}</g>;
}

function zigzagBand() {
  const outer = 205;
  const inner = 185;
  const teeth = 72;
  let d = "";
  for (let i = 0; i <= teeth; i++) {
    const ang = (i * 2 * Math.PI) / teeth;
    const r = i % 2 === 0 ? outer : inner;
    d +=
      (i === 0 ? "M" : "L") +
      (Math.cos(ang) * r).toFixed(2) +
      " " +
      (Math.sin(ang) * r).toFixed(2) +
      " ";
  }
  d += "Z";
  const dotR = 195;
  const dots = 72;
  const dotNodes = [];
  for (let i = 0; i < dots; i++) {
    const ang = (i * 2 * Math.PI) / dots;
    dotNodes.push(
      <circle
        key={i}
        cx={(Math.cos(ang) * dotR).toFixed(2)}
        cy={(Math.sin(ang) * dotR).toFixed(2)}
        r={0.8}
        fill={STROKE}
      />,
    );
  }
  return (
    <g strokeWidth={0.6}>
      <path d={d} fill="none" stroke={STROKE} />
      {dotNodes}
    </g>
  );
}

function processionBand() {
  const groups = 12;
  const r = 155;
  const items = [];
  for (let i = 0; i < groups; i++) {
    const ang = (i * 360) / groups;
    if (i % 2 === 0) {
      items.push(
        <g key={i} transform={`rotate(${ang}) translate(0 ${-r})`}>
          <path
            d="M -14 4 Q 0 -14 14 4 M -10 4 L -10 14 M 10 4 L 10 14 M -14 14 L 14 14 M -10 14 L -10 20 M -4 14 L -4 20 M 4 14 L 4 20 M 10 14 L 10 20 M -18 4 Q -14 -6 -10 -4 M 18 4 Q 14 -6 10 -4"
            fill="none"
            stroke={STROKE}
            strokeWidth={0.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>,
      );
    } else {
      const people = [];
      for (let k = -1; k <= 1; k++) {
        people.push(
          <g key={k} transform={`translate(${k * 9} 0)`}>
            <circle cx={0} cy={-8} r={2} fill={STROKE} />
            <path
              d="M -2 -10 L -4 -16 M 0 -10 L 0 -18 M 2 -10 L 4 -16"
              stroke={STROKE}
              strokeWidth={0.6}
              strokeLinecap="round"
            />
            <path
              d="M 0 -6 L 0 6 M -4 -2 L 4 -2 M 0 6 L -3 14 M 0 6 L 3 14"
              stroke={STROKE}
              strokeWidth={0.7}
              strokeLinecap="round"
            />
          </g>,
        );
      }
      items.push(
        <g key={i} transform={`rotate(${ang}) translate(0 ${-r})`}>
          {people}
        </g>,
      );
    }
  }
  return <g strokeWidth={0.7}>{items}</g>;
}

function spiralBand() {
  const spirals = 20;
  const r = 112;
  const items = [];
  for (let i = 0; i < spirals; i++) {
    const ang = (i * 360) / spirals;
    items.push(
      <g key={i} transform={`rotate(${ang}) translate(0 ${-r})`}>
        <path
          d="M -10 0 Q -10 -6 -4 -6 Q 2 -6 2 0 Q 2 6 -4 6 M 10 0 Q 10 6 4 6 Q -2 6 -2 0 Q -2 -6 4 -6"
          fill="none"
          stroke={STROKE}
          strokeWidth={0.7}
        />
      </g>,
    );
  }
  return <g>{items}</g>;
}

function starCore() {
  const points = 14;
  const rOut = 82;
  const rIn = 30;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const ang = (i * Math.PI) / points - Math.PI / 2;
    const x = Math.cos(ang) * r;
    const y = Math.sin(ang) * r;
    d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2) + " ";
  }
  d += "Z";
  return (
    <g>
      <path d={d} fill={STROKE} opacity={0.55} />
      <circle r={22} fill="none" stroke={STROKE} strokeWidth={0.8} />
      <circle r={14} fill="none" stroke={STROKE} strokeWidth={0.6} />
      <circle r={8} fill={STROKE} opacity={0.8} />
    </g>
  );
}

function tickRing() {
  const ticks = 120;
  const items = [];
  for (let i = 0; i < ticks; i++) {
    const ang = (i * 360) / ticks;
    items.push(
      <g key={i} transform={`rotate(${ang})`}>
        <line x1={0} y1={-245} x2={0} y2={-240} stroke={STROKE} />
      </g>,
    );
  }
  return <g strokeWidth={0.5}>{items}</g>;
}

function DongSonDrum() {
  return (
    <svg
      viewBox="-250 -250 500 500"
      fill="none"
      stroke={STROKE}
      aria-hidden="true"
    >
      <g strokeWidth={0.8}>
        <circle r={245} />
        <circle r={238} />
      </g>
      {birdRing()}
      <g strokeWidth={0.8}>
        <circle r={225} />
        <circle r={205} />
      </g>
      {zigzagBand()}
      <g strokeWidth={0.8}>
        <circle r={185} />
        <circle r={175} />
      </g>
      {processionBand()}
      <g strokeWidth={0.8}>
        <circle r={140} />
        <circle r={130} />
      </g>
      {spiralBand()}
      <g strokeWidth={0.8}>
        <circle r={95} />
        <circle r={87} />
      </g>
      {starCore()}
      <circle r={3} fill={STROKE} />
      {tickRing()}
    </svg>
  );
}

function DongSonHalo() {
  return (
    <svg
      viewBox="-300 -300 600 600"
      fill="none"
      stroke={STROKE}
      aria-hidden="true"
    >
      <g strokeWidth={0.6}>
        <circle r={290} />
        <circle r={280} />
        <circle r={265} />
      </g>
      <g strokeWidth={0.5}>
        <circle r={250} strokeDasharray="2 6" />
        <circle r={235} strokeDasharray="1 3" />
      </g>
    </svg>
  );
}

export default memo(DongSonDrum);
export const DongSonHaloMemo = memo(DongSonHalo);
