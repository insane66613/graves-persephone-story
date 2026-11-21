# The Orchard Between Worlds

An original illustrated interactive fiction experience inspired by Persephone, Hecate, Jungian shadow symbolism, and the freedom to write one's own future. Created as a personal gift for Dawn.

## Current release

- Production story: https://graves.ptelectronics.net/persephone/
- Hostname homepage: unchanged
- 18 branching scenes, each with three choices (54 transitions)
- 5 mythic endings with 3 additional relationship-epilogue outcomes
- 9 original, visually coordinated WebP illustrations, including four new fictional Eric scenes
- Interactive perspective switches for Persephone, Eric, and Hecate in relevant chapters
- An optional self-written fortune, a two-lantern exercise, and a private journal
- Local browser progress with back/replay/restart/erase controls; no server-side journal
- All routes tested in story-smoke.cjs; new story scripts validated with Node's syntax check

## Repository contents

- worker.js: source of the deployed Cloudflare Worker and embedded HTML/CSS/JS story
- assets/: public, original fictional illustration assets served by the production story
- story-smoke.cjs: path and state-machine regression tests
- enhance-v3.cjs: earlier version's story expansion script (historical)

## Fiction and boundaries

This story is publicly reachable by URL, without a login or access control, as requested. *Intended for Dawn* does not mean technologically private. The artwork depicts fictional mythic counterparts, not verified photographs or representations of real individuals. Story dialogue, Eric's characterization, and relationship outcomes are original fictional possibilities rather than verified transcripts, personal diagnoses, or assertions of fact. The story does not publish private messages or confidential personal records.

Visitors' written journals, fortunes, and lantern reflections remain only in their own browser using localStorage. No server stores those text entries. Erasing the path and journal clears local state on that browser.

## Release verification

Run on the Windows 11 workstation with PowerShell 7:

    node X:\Code\graves-persephone-story\story-smoke.cjs
    node --check X:\Code\graves-persephone-story\worker.js

Confirm live HTTP 200 on the story, homepage, and all published asset URLs, followed by live JavaScript syntax validation. Only claim a deployment after these checks succeed.

## Content evolution

Preserve the existing save key and migration behavior for returning readers. Add new scene artwork as reusable named assets and avoid changing old route IDs unless a migration is supplied. Do not change the site's access model without an explicit new instruction.
