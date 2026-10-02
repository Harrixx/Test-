# C.Wood: artist website

A one-page site for C.Wood (Connor), a Leeds rapper and songwriter. It's plain static HTML with no build step, so it can be hosted on Vercel, Netlify or GitHub Pages as-is.

Preview locally: `python3 -m http.server -d connor-site`

Deploys: Vercel builds production from `claude/connor-music-artist-site-8krqvu` (see `vercel.json`), so every push goes live.

## Sections
- **Hero:** the C.Wood logo (redrawn as SVG from the *Illest* artwork) drawing itself in on a ribbed coral background
- **Music:** the debut EP *Illest* (Jan 2021) and the singles *Lost*, *Inner Spirit* and *Tunnel Vision*
- **Story:** Huddersfield to Morley, writing through hard times, plus a timeline
- **It's okay to talk:** his mental health message and UK support lines (Samaritans, Shout, Andy's Man Club)
- **Follow:** socials and a bookings contact

## Facts used
Taken from press coverage (Yorkshire Evening Post, ON Magazine, Ratings Game Music) and his Instagram:
- He grew up in Huddersfield and lives in Morley. He started writing during a difficult period.
- Debut EP *Illest*, January 2021: remasters of his first track and *Inner Spirit*, plus five unreleased songs.
- *Lost* was written after he lost friends to suicide, with all proceeds going to Andy's Man Club.

## To confirm with Connor (search for `TODO` in index.html)
- [ ] The full *Illest* track list and his first single's name
- [x] Spotify artist link (added, with an embedded player)
- [ ] Direct Apple Music, YouTube and SoundCloud links (the buttons currently open a search)
- [ ] Original artwork files (covers are cropped from screenshots), plus the *No More* and *Illest* covers
- [ ] Release dates for *In Too Deep*, *In My Head* and *Lost*
- [ ] The story in his own words, plus gigs, radio plays and press quotes
- [ ] A bookings email
- [ ] A few high-res press photos
- [ ] Whether he's happy for the mental health section to be worded as it is
