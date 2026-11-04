# Timetable Manager — Website

[Website](https://timetablemanager.app) for [Timetable Manager](https://apps.apple.com/us/app/timetable-manager/id6738605424) iOS/iPadOS/Mac app.

[![Website Preview](./assets/images/og/en/card.png)](https://timetablemanager.app)

## Develop

```sh
open index.html                  # works without a server (all paths are relative)
python3 -m http.server 8000      # or serve it: http://localhost:8000/index.html
node scripts/build-langs.mjs     # after editing index.html or translations/home.*.json
node --test tests/               # API tests + checks langs*/index.html are up to date (Node 20+)
```

## Open Source

Timetable Manager is a genuine passion project of mine. I've put a lot of time, care, and effort into making it something I'm truly proud of.

I'd also love to open-source the actual app someday. However, I'm still a little hesitant, as I'd be worried about clones and unauthorized redistribution. I'm still figuring out what the right balance between sharing my work and protecting something would look like.

For now, this repository contains the website only.
