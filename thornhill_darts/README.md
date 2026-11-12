# Thornhill Village Darts League

League website and administration tool for the **Thornhill Village Darts League**
(Thornhill, West Yorkshire, England). Thornhill is the first league on the
platform; the data model and admin tool support further leagues.

No dependencies to install: it uses Node's built-in HTTP server and SQLite
(`node:sqlite`), so it needs **Node 22.5 or newer**.

```bash
cd thornhill_darts
ADMIN_TOKEN='choose-a-long-secret' npm start
# League site:  http://localhost:3000/
# Admin tool:   http://localhost:3000/admin
npm test
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `ADMIN_TOKEN` | random, printed at start-up | Token administrators sign in with |
| `PORT` | `3000` | HTTP port |
| `DB_FILE` | `data/league.db` | SQLite database file |
| `DEFAULT_LEAGUE` | `thornhill` | League shown at `/` |

Run this way, the database is a file on disk, so the host needs a persistent
disk (a VPS, Render, Fly.io, Railway…). Vercel has no persistent disk and is
handled separately: see below.

## Deploying to Vercel

On Vercel the pages in `public/` are served as static files and `/api/*` is
answered by a function. Because a function has no lasting disk, the database
is kept in an **Upstash Redis** store: the SQLite file lives in the function's
temp folder and a compressed copy is saved to Redis after every change
(`src/store.js`). A save only goes through if nobody else has saved since that
copy was loaded, so two administrators cannot overwrite each other.

Two ways to host it, both configured in this repository:

| | Address | Config |
| --- | --- | --- |
| Inside the repository's existing root project | `https://<project>.vercel.app/thornhill/` | `../vercel.json`, `../api/thornhill.js` |
| As its own Vercel project (Root Directory `thornhill_darts`) | `https://<project>.vercel.app/` | `vercel.json`, `api/index.js` |

Settings to add in the Vercel project, then redeploy:

1. **Storage → Create Database → Upstash (Redis)** and connect it to the
   project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
   (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` also work.)
2. **Settings → Environment Variables → `ADMIN_TOKEN`**: a long, hard-to-guess
   phrase. Administrators sign in with it at `/admin`.
3. Node.js version 22.x or newer (Settings → Build and Deployment).

Until step 1 is done the public pages work and show the starting data, but
the admin tool refuses changes and says why. Until step 2 is done the admin
tool is switched off. Nothing is ever accepted and then lost.

The storage copy is the whole database, which suits a league this size (the
starting data is about 5 KB compressed). If it ever grew to several megabytes,
moving to a hosted SQL database would be the next step.

## Initial data

On first start the database is seeded with the league, its 13 teams and the
final positions published following 9 September 2026:

| | Division A | Division B |
| --- | --- | --- |
| 1 | Thornhill Edge A | Flatt Top B |
| 2 | Flatt Top A | Cricket Club B |
| 3 | Black Horse | Overthorpe B |
| 4 | Overthorpe A | Saville Arms |
| 5 | Cricket Club A | Trojans B |
| 6 | Trojans A | Thornhill Edge B |
| 7 | | Scarborough B |

**The published figures are not in the seed.** Only the team names and final
positions were supplied, so played / won / lost / legs for / legs against /
leg difference / points are stored as "not entered" and shown as "—". Nothing
is guessed or derived. To add them, fill in
`public/templates/thornhill-final-standings-2026.csv` (teams already listed in order)
from the published table and upload it under **Admin → Import**, or run:

```bash
npm run import -- standings public/templates/thornhill-final-standings-2026.csv --season "Season ending September 2026"            # check only
npm run import -- standings public/templates/thornhill-final-standings-2026.csv --season "Season ending September 2026" --commit   # save
```

No fixtures, match results, players or scoring rules are seeded.

## How it works

- **Historical vs live standings.** A published table is stored verbatim in
  `historical_standings` and is never recalculated. A live table is calculated
  on request from `fixtures` and is never written back. A season with no
  fixtures has no live table. The two are shown as separate, labelled sections.
- **Import tool** (Admin → Import, or `npm run import`). Accepts `.csv`, `.xlsx`
  (first sheet) or pasted CSV, for either a historical standings table or
  fixtures/results. Every upload is checked first — unknown teams, bad numbers
  and a team in two divisions block the save; figures that do not add up
  (e.g. legs for − against ≠ leg difference) are flagged but kept exactly as
  given. Imports are logged under Import history. Blank templates are in
  `public/templates/`.
- **Clubs and teams.** A team belongs to a club (its pub or venue) and a club
  can have any number of teams. Division membership is per season, so
  Flatt Top A and Flatt Top B sit in different divisions. The club is worked
  out from a trailing letter ("Flatt Top B" → Flatt Top) and can be changed
  under Admin → Teams.
- **Points system.** Starts empty and unconfirmed. Admin → Points system takes
  points for a win / draw / loss and per leg won. Live tables show no points
  column until it is marked confirmed; until then order is provisional (wins,
  then leg difference).
- **Multiple leagues.** Every table hangs off a league. Admin → League &
  branding sets a league's name and colours and can add another league, served
  at `/?league=<slug>`. The league switcher only appears once there is more
  than one.

## Front end

- App-style interface with Table, Fixtures and Clubs views: a bottom tab bar
  on phones, a top bar on larger screens.
- Light and dark themes. It follows the device setting and the toggle in the
  header remembers a manual choice.
- On phones, one division is shown at a time with a switcher, and each team's
  figures sit on a line under its name so nothing scrolls sideways.
- Each club gets its own badge colour, shared by its A and B teams.
- Playful touches: a lime highlight colour, a scrolling ticker of club names,
  a spinning stamp that throws confetti, a crown on whoever finished top,
  and darts slang for three-dart scores ("Ton 40", "Bed & breakfast").
- The middle tab on phones is a raised bullseye that opens the table; tapping
  it throws a dart into the board. The dartboard in the header panel can be
  played too: tap or click it to throw, with a score for each dart and a
  three-dart total. This is decoration only (`public/darts.js`) and never
  reads or writes league data. It is switched off for people who have asked
  their device to reduce motion.
- Installable to a phone home screen (`manifest.webmanifest`, icons in
  `public/icons/`). There is no offline mode.
- Fonts (Inter, Bricolage Grotesque) are self-hosted under the SIL Open Font
  License in `public/fonts/`, so the site makes no third-party requests.
- A league's main colour, set under Admin → League & branding, drives the
  header panel, buttons and highlights.

## Layout

```
server.js            entry point
src/db.js            schema
src/seed.js          Thornhill initial data
src/importers.js     spreadsheet validation + import
src/standings.js     historical read, live calculation, points system
src/teams.js         clubs and teams
src/app.js           HTTP API + static files
src/store.js         where the database lives (local file, or Redis copy on Vercel)
src/vercel.js        Vercel function handler
api/index.js         Vercel function entry point
vercel.json          Vercel routing for a standalone project
public/              league site, admin tool and CSV templates
scripts/import.js    command-line import
test/                node:test suite
```
