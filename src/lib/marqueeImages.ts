const GRADIENTS: [string, string][] = [
  ["#0e7490", "#7c3aed"],
  ["#1e293b", "#0e7490"],
  ["#7c3aed", "#0e7490"],
  ["#334155", "#0ea5e9"],
];

export function labelImage(label: string, index: number): string {
  const [from, to] = GRADIENTS[index % GRADIENTS.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='970' height='700'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${from}'/>
        <stop offset='100%' stop-color='${to}'/>
      </linearGradient>
    </defs>
    <rect width='970' height='700' rx='24' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      font-family='ui-sans-serif, system-ui, sans-serif' font-size='84'
      font-weight='700' fill='#f1f5f9'>${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SIMULATION_MARQUEE_IMAGES: string[] = [
  "Entrevistas",
  "IELTS",
  "Pitch",
  "Idiomas",
  "TOEFL",
  "Negocios",
  "Mock",
  "Ocio",
  "Pitch",
  "Entrevistas",
  "IELTS",
  "Storytelling",
].map((label, i) => labelImage(label, i));
