# Strategy System — How to Use It

This folder turns a client's intake form answers into two polished strategy documents: one for you, one for them. Client files stay on this machine only (`clients/` is gitignored).

## The workflow, start to finish

### 1. Send the client the intake form

Send them the link: `https://shockwavestudios.co/intake`

The page embeds your Tally form. It is not linked in the site nav, so only people with the link find it.

### 2. Generate the strategy

When the Tally submission comes in, you do not need to reformat it yourself. Just copy the whole thing — the notification email or whatever you can copy off the Tally dashboard, in whatever order it's in — and paste it into Claude Code in this repo with something like:

> Here's the intake for [client name]. Format it and run strategy-system/generate-strategy.md

Claude will sort the raw answers into a clean `clients/[client-name]/intake.md`, load the business brain, and write two files into that same folder:

- `internal-strategy.md` — your working doc. Includes risks/watch-outs and internal notes. Never send this to the client.
- `client-strategy.md` — the polished deliverable, written in Shockwave voice, ending with Next Steps.

(If you'd rather build the intake file by hand — say, editing an answer before Claude sees it — copy `intake-template.md` into `clients/[client-name]/intake.md` yourself, paste answers under the matching headings, and point Claude at that file instead.)

### 3. Review before sending

Read both files. Check:

- Every fact traces back to something the client actually said. Resolve any `[PLACEHOLDER: ask client]` markers — ask the client, fill in the answer, and regenerate or edit by hand.
- The client-facing doc never says "ManyChat" and has no em dashes.
- The pillars and post ideas feel like THIS client, not any client.

### 4. Deliver

Send `client-strategy.md` to the client (export to PDF or paste into a doc — your call). Keep `internal-strategy.md` open during your strategy call.

### 5. Feed the brain

After the strategy call, if this is a signed client, create or update their folder in `C:\Users\qshoc\business-brain\clients\` per the brain's onboarding directive. Corrections the client made to the strategy go into their `preferences.md`.

## What's in this folder

| File | What it is |
|---|---|
| `INSTRUCTIONS.md` | This file. |
| `intake-template.md` | Blank intake questionnaire. Copy per client, paste answers in. Also your source of truth for what questions the Tally form should ask — keep the two in sync. |
| `generate-strategy.md` | The prompt Claude Code follows to generate the two strategy docs. Edit this file to change what strategies include. |
| `clients/` | One folder per client with their intake and generated strategies. Gitignored — never pushed to GitHub. |

## Keeping Tally and the template in sync

If you add, remove, or reword a question in Tally, make the same change in `intake-template.md` (and vice versa). If they drift, answers stop lining up with headings and the generator gets worse.
