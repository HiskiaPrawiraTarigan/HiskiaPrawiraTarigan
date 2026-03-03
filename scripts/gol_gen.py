import random, os

W, H       = 40, 20
CELL       = 18
PAD        = 12
N_FRAMES   = 40
FRAME_DUR  = 0.12
TOTAL_DUR  = N_FRAMES * FRAME_DUR
DEAD       = '#0d1117'
BORDER     = '#21262d'
PALETTES   = ['#58a6ff','#3fb950','#d2a8ff','#f0883e','#e3b341','#79c0ff','#56d364','#ff7b72']

def cell_color(r, c): return PALETTES[(r + c * 3) % len(PALETTES)]

def random_grid(seed=42):
    random.seed(seed)
    return [[1 if random.random() > 0.55 else 0 for _ in range(W)] for _ in range(H)]

def step(g):
    new = [[0]*W for _ in range(H)]
    for r in range(H):
        for c in range(W):
            nb = sum(g[(r+dr)%H][(c+dc)%W] for dr in(-1,0,1) for dc in(-1,0,1) if(dr,dc)!=(0,0))
            new[r][c] = 1 if (g[r][c] and nb in(2,3)) or (not g[r][c] and nb==3) else 0
    return new

grid = random_grid()
frames = [grid]
for _ in range(N_FRAMES - 1):
    grid = step(grid)
    frames.append(grid)

SVG_W = W * CELL + 2 * PAD
SVG_H = H * CELL + 2 * PAD

parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SVG_W} {SVG_H}" width="{SVG_W}" height="{SVG_H}">',
    f'<rect width="{SVG_W}" height="{SVG_H}" rx="10" fill="{DEAD}"/>',
    f'<rect x="{PAD-2}" y="{PAD-2}" width="{W*CELL+4}" height="{H*CELL+4}" rx="6" fill="none" stroke="{BORDER}" stroke-width="1"/>',
]

for r in range(H):
    for c in range(W):
        x = PAD + c * CELL + 2
        y = PAD + r * CELL + 2
        sz = CELL - 4
        ac = cell_color(r, c)
        vals  = ';'.join(ac if frames[f][r][c] else DEAD for f in range(N_FRAMES))
        ktims = ';'.join(f'{f/(N_FRAMES-1):.3f}' for f in range(N_FRAMES))
        parts.append(
            f'<rect x="{x}" y="{y}" width="{sz}" height="{sz}" rx="2" fill="{DEAD}">'
            f'<animate attributeName="fill" values="{vals}" keyTimes="{ktims}" '
            f'dur="{TOTAL_DUR:.2f}s" repeatCount="indefinite" calcMode="discrete"/></rect>'
        )

parts.append(
    f'<text x="{SVG_W//2}" y="{SVG_H-4}" font-family="monospace" font-size="9" '
    f'fill="#6e7681" text-anchor="middle">Conway\'s Game of Life · self-playing</text>'
)
parts.append('</svg>')

os.makedirs('dist', exist_ok=True)
out = 'dist/game-of-life.svg'
with open(out, 'w', encoding='utf-8') as f:
    f.write('\n'.join(parts))
print(f"Generated {out} — {len(''.join(parts)):,} bytes")
