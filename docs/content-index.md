# Content & Feature Index

Tracks test/demo pages authored in da.live and the block features they exercise. Update this whenever a new test page or block variant is added.

| Path | Purpose | Block(s) | Status | PR |
| --- | --- | --- | --- | --- |
| Site-wide (`styles/styles.css`) | Day 1: updated global color tokens (`--background-color`, `--text-color`, `--link-hover-color`) | — | Live on main | [#1](https://github.com/Shekhar-sj/ssj-eds-da/pull/1) |
| `/banner-test` | Day 2: Banner block — image + title over full-width backdrop, background color optional (row 3), defaults to blue. Covers default color, custom color, and the `Banner (dark)` variant (with/without custom color); each instance authored in its own section for correct spacing. | `banner` | Live on main, CMS-verified | [#2](https://github.com/Shekhar-sj/ssj-eds-da/pull/2), [#3](https://github.com/Shekhar-sj/ssj-eds-da/pull/3) |
| `library/blocks/hero` | Day 2: registered `Hero` in the da.live block Library — `library/blocks` sheet (name/path index) + `library/blocks/hero` doc (working example) + `library` tab in the site `config` sheet pointing at `library/blocks.json`. da.live-only, no repo code involved. Confirmed: Hero appears in the Library panel when authoring `banner-test`. | `hero` | CMS-verified | [#4](https://github.com/Shekhar-sj/ssj-eds-da/pull/4) |
| `/` (homepage) | Day 2: added a separate, third section with a `Section Metadata` (`Style: highlight`) table, giving it the existing light-grey (`--light-color`) background — visually distinct from the cyan default. da.live-only, no repo code involved (uses existing `main .section.highlight` rule in `styles/styles.css`). | — | CMS-verified | (pending, bundled with next PR) |

## Columns

- **Path**: da.live document path (same path on `.aem.page` / `.aem.live`)
- **Purpose**: what the page demonstrates and any notable edge cases covered
- **Block(s)**: block name(s) used on the page
- **Status**: `Draft` (local/da.live only, not merged), `In PR` (link included), `Live on main`
- **PR**: link to the PR that introduced/last touched the related code, if any
