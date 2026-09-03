# Shockwave Studios (shockwavestudios.co)

Astro marketing site for Shockwave Studios, a social media marketing agency in Melbourne, Florida.

## Canonical source warning

**This folder is the canonical site.** A stale copy exists at `C:\Users\qshoc\shockwave-studios` (no `Documents\`). It is a wrong-folder artifact holding superseded copy and pricing. Never edit it, never read it for facts, never cite it as a source.

## Business facts live in the brain, not in this repo

Before changing any copy, pricing, stats, claims, service descriptions, or client references on this site, read `C:\Users\qshoc\business-brain\CLAUDE.md` and follow its context-loading order:

1. `context/agency.md` and `context/core_values.md`
2. `context/brand_voice.md` for anything user-facing
3. `brain/INDEX.md`, then open only the notes that apply

**One fact, one place.** Do not restate pricing, tier contents, video counts, results, or client names in this file or in source comments. Duplicating them here is how the stale copy above went wrong. Read the current values from the brain every time:

- Retainer pricing and tier contents: `brain/references/2026-07-07_service-packages-and-pricing.md` (superseded numbers appear in older `brain/decisions/` notes, check the dates)
- Approved results and claims: the brain's references, never invented

If a change to this site alters pricing or claims, update the brain's reference note too, and add a dated line to `brain/INDEX.md`.

**Never fabricate numbers, results, client names, or testimonials.** Mark gaps as `[PLACEHOLDER: ask Ashton]` and ask. Confident fiction is the worst failure mode here.

## Public copy rules

- **Say "Social Media Automation."** Never "ManyChat" in anything public facing.
- **No em dashes.** Use commas, hyphens, or split the sentence. Scan programmatically rather than by eye, they are easy to miss.
- **Split paragraphs at thought shifts.** One idea per paragraph.
- **Never fabricate first-person history.** No invented timelines or "we have done X since..." claims.
- Full voice rules live in the brain at `context/brand_voice.md`. That file wins over this summary.

## Anti-slop gate

Treat these as pass/fail before any copy ships:

- **Banned hype and filler:** delve, tapestry, testament, realm, landscape, navigate, unleash, elevate, supercharge, game-changer, revolutionize, in today's fast-paced world, when it comes to, it is worth noting, the bottom line, in conclusion.
- **Structural tells:** uniform paragraph lengths, "not only... but also," rule-of-three everywhere, intros that restate the heading, conclusions that summarize instead of resolve.
- **Substance tells:** claims with no specifics, no point of view, no real example. If a competitor could publish the sentence verbatim, it is slop.

## Working rules

- **Execute, do not delegate back.** If you can do it with your tools, do it. Confirm first only for destructive or irreversible actions.
- **Verify before reporting done.** Check your output against the request and say plainly if something failed or was skipped.
- **Complete multi-part requests fully.** Re-read the original message before responding.
- **Propose doc updates, never auto-apply them.** If something you learn contradicts this file or the brain, name the file, show old text to new text, and ask.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
