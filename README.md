# Harshil weds Khushali

The invitation, as a standalone Next.js site. One page, no database, no API
call — every name, date, venue and phone number lives in
`components/Invitation.jsx`, which is why this builds to static HTML and costs
nothing to serve.

```
npm install
npm run dev      # http://localhost:3000
npm run build    # static export of one route
```

## Deploying to Vercel

Import the repository and accept the defaults. Vercel detects Next.js, runs
`next build`, and the one route prerenders as static content.

Nothing needs configuring: there are no environment variables, no runtime and
no image optimisation (the plates are fixed artwork and the component asks for
them `unoptimized`, so `next.config.mjs` turns the pipeline off rather than
paying for transformations that never happen).

For `harshilwedskhushali.com` or similar, add the domain under the project's
Domains tab and point the registrar's nameservers at Vercel.

## What is where

| path | holds |
| --- | --- |
| `app/` | the shell: one page, one layout, the stylesheet |
| `components/Invitation.jsx` | the whole invitation — gate, monogram, sections, events, map, invitees |
| `public/templates/custom/template2/` | the artwork, keyed and sized for this site |
| `public/templates/custom/template1/background-2.webp` | the names card, the one plate still borrowed from the old template 1 |
| `backend/` | optional, unused — see `backend/README.md` |

Asset paths were left exactly as the component had them, so the file reads the
same as it did in the old repo and diffs against it cleanly.

## The content, and where to change it

All of it is near the top of `components/Invitation.jsx`:

- `VENUES` — the three places, with the Maps links behind them.
- `EVENT_DATA` — the five functions, each with its artwork, verse, date, time
  and venue. **Dandiya Night's 8:00 PM is still a guess** and carries a `TODO`.
- `INVITEE_PHONES` — **read these back before sending.** They were transcribed
  from a decorative Gujarati numeral face and have not been confirmed.
- `EVENT_BOARDS` / `BOARD_SIZE` — how the functions are split across boards.

## Assets

Only what the invitation draws was carried over: 33 MB in the old repo, 6.3 MB
here. Pictures were re-encoded to WebP and capped at the width they are
actually drawn at on a phone at 3x — a cut-out like the monogram plate went
from 1.2 MB as PNG to 170 KB.

The one thing left untouched is `sounds/aaj-ibaadat.mp3`: 2.7 MB, which is 43%
of the whole site. It is a 72-second clip encoded at 320 kbps, far beyond what
background music under a page needs. There was no encoder on the machine this
was assembled on, so it was copied as-is. Re-encoding it halves the site:

    ffmpeg -i aaj-ibaadat.mp3 -b:a 96k -ac 1 aaj-ibaadat.mp3    # ~0.8 MB

It is fetched only when the reader first touches the screen, so it never
delays the first paint — but it is worth doing before this goes to guests on
mobile data.
