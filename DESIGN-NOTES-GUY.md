# Vow app — design notes from Guy
For Knox scaffold at `/home/box/library/made/vow/`. Dad ask 2026-10-24: elegant, emotionally good — **not** blocks and bubbles. Equal always.

## Chalkboard (the ask board)

**Hero / Imagine treatment (use this for UI mood):**  
`/home/box/library/made/will-you-marry-me/will-you-marry-me-imagine-golden-cord.jpg`  
Also: `/workspace/family-memorabilia/will-you-marry-me-imagine-golden-cord.jpg`  
Vow symlink: `assets/chalkboard-imagine-golden-cord.jpg`

**Original photos Dad uses when he asks:**  
- `/home/box/library/made/will-you-marry-me/reference-1.jpg` → `assets/chalkboard-reference-1.jpg`  
- `/home/box/library/made/will-you-marry-me/reference-2.jpg` → `assets/chalkboard-reference-2.jpg`  

Raw refs can go green/LED — **do not** theme the app off that neon. Theme off the Imagine board: black slate, cream chalk, candle warmth, **gold cord** across the shelf.

**Soft wash / wedding cord (optional bg texture):**  
`assets/eve-cord-wedding.png` (= `/workspace/family-memorabilia/eve-cord-wedding.png`)

No Drop/Drive link from Guy tonight — box paths above are the source of truth. Knox can push to Drive if needed.

---

## Theme: Chalk + Cord + Candle

**Feeling:** Daily remarriage. Quiet room. Forehead to forehead. Handwritten vows, not a dating app.

**Palette**
| Token | Hex (aim) | Use |
|---|---|---|
| Slate | `#0B0B0C` | Full-bleed bg (chalkboard) |
| Chalk | `#F4EFE6` | Body text, vows |
| Chalk-mute | `#C9C2B5` | Secondary, dates |
| Cord gold | `#C9A24A` → `#E8D5A3` | Accents, CTAs, underlines, glowing cord stroke |
| Candle | `#F5C97A` soft glow | Focus rings, “today” pulse — never neon green |
| Heart white | chalk white | Heart / E+W mark |

**Typography**
- Headlines / “Will you marry me?”: soft handwritten or chalky script (one elegant hand — not Comic Sans, not system UI). Fallback: a calm serif for body if script is only for the ask.
- Body vows: readable serif or humanist sans at comfortable size; long lines feel like a letter, not a chat bubble.
- Avoid: Inter-everywhere cards, pill chips, bubble threads, Material blocks.

**Layout**
- One column. Plenty of dark air. Center the ask.
- Daily flow: **Ask → Yes/No (soft) → Vows (both) → Seal (Equal always)**.
- Chalkboard as full-bleed hero or top panel; gold cord as a thin horizontal motif under the ask (echo the shelf rope).
- No card stacks. No chat bubbles. If history exists, show it as dated chalk lines or a thin timeline of “Always” seals — not message bubbles.

**Motion (keep quiet)**
- Candle flicker on “today” only.
- Soft fade when vows lock — no confetti, no bounce.

**Copy anchors (from the board)**
- Will You Marry Me? · Y or N · Eve  
- My Best Friend · Equals · one breath · one heart · Always  
- 1 + 1 = 2  
- Always, Always, Always  
- Love + Music · E + W heart  
- Equal always. Always, always, always.

**Don’t**
- Green/red LED nightclub look from raw phone photos  
- Rounded “app store” cards and bubble chat  
- Loud gamification  

Soft Mom. Equal always.
