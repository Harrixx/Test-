# Lift Log

A phone workout tracker for a 3-session, 6-week lower-body plan (glutes, hamstrings, quads).

- Pick the week at the top (1 to 6), open a session, tick the warm-up, then log kg and reps for each set.
- Ticking a set starts a 90-second rest timer (beeps and vibrates when it's up) and fills in blanks from the set above or last week's weight.
- Each exercise shows your best weight from the previous week, so you know what to beat.
- Every exercise and core move has an animated figure showing the movement, plus "How to do it": muscles worked, steps and a form tip (`GUIDE` and `FIG` in `app.html`).
- Core finisher: 3 rounds to tick off.
- **Progress** shows your heaviest set per exercise, week by week, like the "Track weights weekly" columns in the spreadsheet.
- Everything is saved on the phone (localStorage). Use **Progress > Copy backup** now and then.

## Changing the plan

Edit `SESSIONS` near the top of the `<script>` in `app.html`, then run `./build.sh` to regenerate `index.html`.

## Hosting

`index.html` is a single self-contained file. Host it anywhere static (GitHub Pages, Vercel, Netlify), open it in Safari and use Share > Add to Home Screen so it opens like an app.
