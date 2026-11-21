# The Orchard Between Worlds

An original illustrated, branching mythic story written as a gift for Dawn, drawing on Persephone, Hecate, and shadow-work symbolism. The characters and dialogue are fictional, including the portrayal of Eric.

## Production

- Live story: https://graves.ptelectronics.net/persephone/
- Deployment: Cloudflare Worker graves-persephone-story on the existing path-specific route
- Homepage at graves.ptelectronics.net/ is not modified
- No login or access control: this story is publicly reachable by link
- Repository: https://github.com/insane66613/graves-persephone-story

## Experience (v5)

- 20 distinct scenes, 60 interactive choice transitions, all reachable
- Five mythic endings plus three possible fictional relationship epilogues
- Nine coordinated original fictional illustrations
- New chapters: The Letter She Never Owed Anyone and The Small Day After the Underworld
- Optional unsent letter, which stays on the device and is never sent to Eric
- Journey atlas showing previous scene illustrations and choices; readers can rewind and revise without erasing writing
- Focus reading view on desktop and mobile
- Explicit, locally generated .txt keepsake: choices, outcome, fortune, lantern observations, unsent letter and optional private journal
- Existing Hecate/Persephone/Eric perspective selector and two-lantern exercise
- Local browser storage using the original graves_orchard_between_worlds_v1 key, with additive migration of the new optional state fields
- Begin again resets choice history while keeping private writing; Erase clears everything from this browser

## Privacy and factual distinction

"Made for Dawn" does not mean technically private. Anyone with the URL may view the fictional story, and the illustration assets are public. Do not add private messages, source transcripts, diagnoses, sensitive biographical records, real likenesses, or purported real-person mental states without explicitly scoped permission.

Text that visitors write (journals, lanterns, fortune, unsent letter) remains in browser local storage. The program does not send that writing to the server. The user-controlled keepsake download creates a local .txt containing this writing; the interface labels this clearly.

## Files

- worker.js: deployable Worker source, embedding HTML, CSS, story data and browser-side logic
- assets/: nine coordinated WebP assets
- story-smoke.cjs: local branch/state-machine, reachability, writing, atlas, ending, download and focus-mode regression tests

## Test and deploy (PowerShell 7)

    node --check X:\Code\graves-persephone-story\worker.js
    node X:\Code\graves-persephone-story\story-smoke.cjs

After source control commit and pushing a clean main, deploy the exact committed worker.js to the existing Cloudflare Worker, then independently check the live story, JavaScript parse, and image URLs. Do not change the domain's DNS, homepage, unrelated Worker routes, or access model.

When adding scenes, avoid renaming existing IDs and preserve current browser saves; ensure all scene IDs remain reachable and all choices are covered by the smoke tests.
