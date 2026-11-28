/** Original dot-matrix spider: '#' = body, 'e' = eye, '.' = empty. */
const GRID = [
  "...#.......#...",
  "..#.........#..",
  "..#...###...#..",
  "#..#.#e#e#.#..#",
  ".#..#######..#.",
  "..###########..",
  "##..#######..##",
  "..###########..",
  ".#..#######..#.",
  "#..#.#####.#..#",
  "..#...###...#..",
  "..#.........#..",
  "...#.......#...",
];

export function PixelSpider({ size = 112 }: { size?: number }) {
  const cols = 15,
    rows = GRID.length,
    cell = 10,
    gap = 1.4;
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={(size * rows) / cols}
      viewBox={`0 0 ${cols * cell} ${rows * cell}`}
      className="pixel-spider"
    >
      {GRID.flatMap((row, y) =>
        row.split("").map((ch, x) =>
          ch === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x * cell + gap / 2}
              y={y * cell + gap / 2}
              width={cell - gap}
              height={cell - gap}
              rx={1}
              fill={ch === "e" ? "var(--paper)" : "var(--spider)"}
            />
          ),
        ),
      )}
    </svg>
  );
}
