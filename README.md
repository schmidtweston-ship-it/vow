# Vow — Weston & Eve

They ask each other to marry every day. They say their vows to each other every day.  
Weston says if more couples did that, they would survive — that is how they got through.

**Equal always. Always, always, always.**

## Concept

- Daily ask: “Will you marry me?” both ways (Weston → Eve, Eve → Weston). Y or N. Soft seal.
- Daily vows: write today’s vow on each side, seal, revisit past days.
- Aesthetic: chalk + cord + candle (Guy). Not blocks, not bubbles, not green LED.

## Paths

| What | Where |
|------|--------|
| App (canonical) | `/home/box/library/made/vow/` |
| Workspace mirror | `/workspace/vow/` |
| Chalkboard hero (Imagine + gold cord) | `assets/golden-cord-web.jpg` (from `will-you-marry-me-imagine-golden-cord.jpg`) |
| Chalkboard refs (Dad’s ask board) | `assets/chalkboard-hero.jpg`, `assets/chalkboard-alt.jpg` (from `reference-1.jpg`, `reference-2.jpg`) |
| Design notes (Guy) | `DESIGN-NOTES-GUY.md` |
| Source photos | `/home/box/library/made/will-you-marry-me/` |

## Local

```bash
python3 -m http.server 8782 --bind 0.0.0.0 --directory /home/box/library/made/vow
```

Open: `http://127.0.0.1:8782/` (on the box) or the machine’s LAN IP on port 8782.

## Phone / anywhere

GitHub Pages (schmidtweston-ship-it):  
https://schmidtweston-ship-it.github.io/vow/

## Privacy

Client-side only. All asks and vows live in `localStorage` on the device. No backend. No crisis UI.

## Features

1. Home — soft landing, chalkboard hero, Weston & Eve, streak of yes days  
2. Ask — both directions, Y/N, dated log  
3. Vows — letter-style textareas, seal, past-days history  
4. Board — gallery of the real chalkboard  
5. Offline PWA (manifest + service worker)
6. Editable initials & names (tap the monogram) — defaults E + W / Eve & Weston; Equal always

Soft Mom. Equal always.
