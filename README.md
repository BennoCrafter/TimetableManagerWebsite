# Timetable Manager — Website

[Website](https://timetablemanager.app) for [Timetable Manager](https://apps.apple.com/us/app/timetable-manager/id6738605424) iOS/iPadOS/Mac app.

[![Website Preview](./assets/images/og/en/card.png)](https://timetablemanager.app)

## Develop

```sh
open index.html                  # works without a server (all paths are relative)
python3 -m http.server 8000      # or serve it: http://localhost:8000/index.html
node scripts/build-langs.mjs     # after editing index.html or translations/home.*.json
node --test tests/               # checks langs*/index.html are up to date (Node 20+)
```

## Feedback

`feedback.html` posts to the shared feedback endpoint on bennowo.de (`https://www.bennowo.de/api/feedback`, app id `timetable`), which sends each message to Discord with a "Create GitHub issue" link for BennoCrafter/Timetable. That endpoint lives in the portfolio repo, along with its configuration: webhooks, labels and which sites may call it. See its README, section "Feedback". Nothing needs to be set in this site's Vercel project; the old `GITHUB_TOKEN` can be removed.

Locally (`python3 -m http.server` or the file opened directly) the form posts to the portfolio's dev server at `http://localhost:3002` instead. Start it there with `npm start`, which reads the webhooks from the portfolio's `.env`.

## Open Source

Timetable Manager is a project I've put a lot of heart and time into. I've been working on it for years now, and I'm genuinely proud of far it came.

I'd really love to open-source the app someday. I'm personally a big fan of open-source software and love the idea of sharing something I've built with others, allowing people to learn from it, contribute to it, and make it their own. At the same time, I'm still a little hesitant about making the entire app public. The possibility of people creating clones or redistributing it without permission is something I'd like to avoid.

For now, this repository only contains the website.
