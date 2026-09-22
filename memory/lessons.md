# Lessons — staging ledger

## [2026-09-21] Telegram cannot open delivered HTML game files
- Signal: user could not open rust-quest.html from Telegram ("เปิดบนเทเลแกรมไม่ได้") — internal viewer unusable for interactive HTML.
- Root cause: Telegram in-app document preview does not run interactive HTML properly; single-file delivery works for docs the user saves/opens in a browser, but not for games.
- Lesson: interactive apps must be delivered as a URL (GitHub Pages on this public repo) alongside the file; files alone are doc-delivery, not game-delivery.
- Scope: all future interactive deliverables (games/apps); static docs can stay file-first.

## [2026-09-21] Render QC detectors need calibration against a known-good bisect
- Signal: declared the rendered game "broken" twice; both times the page was fine — my ink thresholds were wrong (card bg #161b22 vs page bg #0d1117 differ by <40; thin Thai text rows missed by sparse sampling).
- Root cause: threshold/density heuristics chosen by gut, validated never.
- Lesson: before trusting a pixel-detector, calibrate it on a known-content bisect file and check for EXPECTED specific colors/elements; a detector failing on a known-good page is a detector bug first, page bug second.
- Scope: all wkhtmltoimage/PIL QC pipelines.
