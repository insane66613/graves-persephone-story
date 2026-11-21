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

## Hecate's Book of Wisdom (v6)

An optional, evidence-aware learning layer is integrated into every story chapter.

- Nine selectable lessons explaining a philosophical or psychological concept, how it appears in the fictional story, an ordinary-life example, and limitations.
- Interactive three-choice exercises with explanations, completed-practice indicators, and 10 verifiable external reading links.
- Coverage: the Homeric Hymn's Persephone/Hecate, Jungian persona and shadow, cognitive "mind reading" and evidence testing, Epictetus's volition, ethics of respect and relational repair, self-compassion, and individuation.
- Lesson-specific reflections are saved only in the visitor's existing browser local storage, included in the keepsake only when explicitly downloaded, and deleted by the existing erase action.
- Book of Wisdom can be opened from the start of the story, the desktop side rail, or a contextual button inside every chapter.
- The existing story save key and all 20 scenes/60 choices are preserved; the new lesson state migrates additively from previous browser saves.

Educational source material resides in `wisdom-lessons.json` and is compiled into the self-contained deployed Worker with `build-wisdom.cjs`. Tests live in `wisdom-smoke.cjs` alongside the existing story tests.

Run both tests before deployment:

    node X:\Code\graves-persephone-story\story-smoke.cjs
    node X:\Code\graves-persephone-story\wisdom-smoke.cjs

The conceptual labels deliberately distinguish ancient myth, Jungian interpretive theory, philosophical ethics, and evidence-informed cognitive exercises. Nothing in the lessons diagnoses a real person or treats a symbolic interpretation as proof of someone's motives.

## Site-wide Google Analytics 4 (November 2026)

- GA4 measurement ID: G-Z569M020PS.
- Cloudflare Google Tag Gateway is enabled on the proxied ptelectronics.net zone, at the first-party /gmetrics endpoint, with automatic native Google tag insertion (setUpTag=true).
- Do not install an additional manual gtag.js or Google Tag Manager snippet on these pages. The Gateway inserts the tag once per eligible HTML response.
- Cloudflare Zaraz GA4 Managed Component ga4pte1 was intentionally disabled to avoid duplicate pageview events. It remains configured for rollback, but does not send GA4 events while disabled.
- For ptelectronics.net and www.ptelectronics.net only, a Cloudflare Response Header Transform Rule (ruleset 58199d8235024354aa71375359a98ee8, rule ref ga4_tag_root_csp_sha256_20261121) permits the exact injected Google Tag bootstrap using its SHA-256 hash, rather than broadly enabling inline scripts. Existing site CSP controls remain.
- Other subdomains may have their own CSP requirements. The Persephone Worker's current CSP permits first-party /gmetrics script and collection and preserves its existing media, framing and default restrictions.
- The Google tag is visible in live browser-style HTML requests at root, www, Graves, Persephone and Zeppoles. The first-party Google script URL returns HTTP 200. This does not itself prove GA4 reports have received events; confirm with Google Analytics Realtime / Tag Assistant.
- No custom tracking events are wired to the Persephone story's journals, letters, fortunes, or educational reflections. Those stay in local browser storage unless the visitor chooses to download a keepsake.
- Existing Cloudflare Web Analytics beacon remains separate.
- Cloudflare Gateway and the Response Header Transform Rule are zone-level infrastructure settings, not deployed from this repository.

Verification commands:

    node X:\Code\graves-persephone-story\analytics-smoke.cjs
    node X:\Code\graves-persephone-story\story-smoke.cjs
    node X:\Code\graves-persephone-story\wisdom-smoke.cjs

Rollback: disable Gateway (enabled=false and setUpTag=false), remove the isolated root-CSP response transform rule, and re-enable the Zaraz GA4 tool if needed. Do not enable both GA4 pageview senders simultaneously.

## GA4 Realtime collection repair (2026-11-21)

**Verified defect:** Cloudflare Google Tag Gateway delivered the Google tag but no `gtag('config', 'G-Z569M020PS')` command was present in the browser's `dataLayer`. The Google installation test detected the tag, but Chrome produced no GA4 collection request. A controlled manual configuration in an isolated diagnostic browser caused `POST /gmetrics/ga/g/c` and `POST https://www.google-analytics.com/g/s/collect` responses of HTTP 204.

**Production repair:**

- `infra/ga4-init-worker.js` is the separately deployed `ptelectronics-ga4-init` Cloudflare Worker. It adds the missing initialization once per HTML response without reading local storage, forms, journal entries or other visitor-authored text.
- Worker routes are scoped to the marketing pages on `ptelectronics.net/*`, `www.ptelectronics.net/*`, `graves.ptelectronics.net/*`, and `zeppoles.ptelectronics.net/*`. A more-specific `graves.ptelectronics.net/persephone/*` route continues using the story Worker. The Google gateway `/gmetrics/*` routes have null-script exclusions, because sending the first-party Google loader through the marketing Worker would break the gateway.
- The existing `graves-persephone-story` Worker embeds the same one-time initializer in the story's HTML. The original story branch structure, journal, and browser storage key remain unchanged.
- A narrow response-header rule on the root and `www` sites permits the exact script via SHA-256 `hrgh4GcqPTs6lCXTie51xggzfwgbgUgMCzF/oCgAlyM=`, preserving the prior Google Tag Gateway bootstrap hash and other protections.
- Google Tag Gateway remains enabled, and the overlapping Cloudflare Zaraz GA4 component remains disabled to avoid double counting.
- The staging route `ptelectronics.net/__ga4-preview/*` verified that the initializer caused first-party and Google collection endpoints to respond HTTP 204 before the main root route was enabled. Remove the staging route after release verification.
- Browser-level Chrome DevTools Protocol diagnostics were saved locally outside this repository. HTTP 204 confirms collection endpoints accepted requests, but does not conclusively prove the selected GA4 property reports those events. Final confirmation is GA4 Realtime/DebugView with the matching stream and no active filters.

Run tests:
```powershell
node X:\Code\graves-persephone-story\infra\ga4-init-check.cjs
node X:\Code\graves-persephone-story\analytics-smoke.cjs
node X:\Code\graves-persephone-story\story-smoke.cjs
node X:\Code\graves-persephone-story\wisdom-smoke.cjs
```

Rollback: remove only the marketing site's `ptelectronics-ga4-init` routes and restore the story Worker's prior version; keep the `/gmetrics/*` exclusions if broad routing is still active. Restore the original response-header hash list after removing the initializer. Keep zone-wide Google Tag Gateway enabled only when the site is otherwise correctly initializing GA4.
