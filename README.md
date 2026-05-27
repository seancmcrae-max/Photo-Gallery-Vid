# Photo Booth Slideshow

A [Remotion](https://www.remotion.dev/) video composition styled as a macOS Photo Booth window. It plays through 102 media items — film scans, party photos, and video clips — and renders them to a 1280×720 MP4.

## Prerequisites

- Node.js 18+
- `npm install`

## Adding the required video files

Video files are excluded from git (`.gitignore`). You must manually copy the following 6 files into the `public/` folder before previewing or rendering:

| File | Source | Duration hint |
|------|--------|--------------|
| `ive 26 bday.MPG` | Google Drive → "Ive 30th" | ~60 s |
| `Ive 26th pt2.MPG` | Google Drive → "Ive 30th" | ~15 s |
| `IMG_3256.m4v` | Google Drive → "Ive 30th/Throwbizzy" | ~15 s |
| `IMG_2804.m4v` | Google Drive → "Ive 30th/Throwbizzy" | ~15 s |
| `IMG_2686.m4v` | Google Drive → "Ive 30th/Throwbizzy" | ~20 s |
| `mami bday dance.m4v` | Google Drive → "Ive 30th" | ~20 s |

Download each file from Google Drive and place it directly in `public/`. The filenames must match exactly (case-sensitive).

> **Tip:** If the actual durations differ from the estimates above, update the `durationInFrames` values in `src/PhotoBooth.tsx` (multiply seconds by 30 for 30 fps).

## Running the Remotion Studio (preview)

```bash
npm start
```

Opens the Remotion Studio at `http://localhost:3000` where you can scrub through the timeline.

## Rendering to MP4

```bash
npm run render
# output: out/slideshow.mp4
```

## Playlist order

1. `ive 26 bday.MPG` — opening birthday video
2. `Ive 26th pt2.MPG` — second birthday clip
3. 19 film-scan JPGs (mcrae rolls 2524, 5038, 2223)
4. 85 Throwbizzy party photos + 3 interspersed video clips (`IMG_3256.m4v`, `IMG_2804.m4v`, `IMG_2686.m4v`)
5. 6 OLDIES prom photos (`prom 4-9.jpg`)
6. `mami bday dance.m4v` — closing clip
