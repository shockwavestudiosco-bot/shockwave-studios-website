# Generate Strategy — Prompt

You are generating a client social media strategy for Shockwave Studios, a social media marketing agency in Melbourne, Florida owned by Ashton Shock. A client's intake answers have been provided in this conversation, either as a file path or pasted directly.

## Step 0: Get the intake into a clean file

The answers you're given will be in one of two shapes:

- **Already a file** at `strategy-system/clients/[client-name]/intake.md`, matching `intake-template.md`'s headings. Skip straight to "Before you write anything."
- **Raw and unstructured** — pasted straight from a Tally notification email or copied off the Tally dashboard. It may be out of order, missing some questions, and full of Tally interface noise (character counts, "Required", question numbers, etc.).

If it's raw:

1. Find the business name in the answers and kebab-case it for the folder name.
2. Create `strategy-system/clients/[client-name]/intake.md` using `intake-template.md` as the heading structure.
3. Match each raw answer to the question it actually answers — go by content, not by whatever order the raw text happens to be in.
4. Strip out Tally UI noise. Write "Not answered" under any heading with no matching answer.
5. Save the file, then continue below using it as the completed intake.

## Before you write anything

1. Read `C:\Users\qshoc\business-brain\CLAUDE.md` and follow its rules.
2. Load `C:\Users\qshoc\business-brain\context\agency.md`, `context\core_values.md`, and `context\brand_voice.md`.
3. Load relevant skill files from `C:\Users\qshoc\business-brain\skills\` (short-form hooks, ManyChat flows, discovery calls — whatever applies).
4. If this client already has a folder in `C:\Users\qshoc\business-brain\clients\`, read all four files there. Its `rules.md` overrides everything in this prompt.
5. Read the completed intake top to bottom before writing a single word.

## Hard rules

- **Never invent facts about the client.** Everything in both documents must trace back to an intake answer, a business-brain file, or be clearly framed as a recommendation. If a needed fact is missing, write `[PLACEHOLDER: ask client]` and list all placeholders at the top of the internal doc.
- **Never fabricate numbers or results.** No projected view counts, no promised lead numbers. The only proof stats allowed are the ones in `brain/references/` (e.g. the PWO results).
- "ManyChat" may appear in the INTERNAL doc only. In the CLIENT-FACING doc it is always "Social Media Automation" or "lead automations".
- No em dashes in the client-facing doc. Short sentences. No jargon (no "synergy", "leverage", "omnichannel", "funnel-first", etc. — see the banned list in `brand_voice.md`).
- The strategy must be specific enough that it could not be sent to a different business unchanged (core value #3). Pull the client's actual words from the intake into the voice profile and post ideas.

## Output

Create the folder `strategy-system/clients/[client-name]/` (kebab-case the business name) and write TWO files.

### File 1: `internal-strategy.md` (for Ashton only)

Structure it exactly like this:

```
# [Business Name] — Internal Strategy
Date: YYYY-MM-DD
Placeholders to resolve: [list any, or "none"]

## 1. Client Snapshot
Business, what they sell, location, audience, stated goals, budget/tier if
known, and their honest capacity (camera comfort score, filming days/times
available, anything off-limits to film).

## 2. Brand Voice Profile
- Tone: one or two sentences
- 5 words that describe the voice
- Phrases to use (pull from how the client actually talks in the intake)
- Phrases to avoid (their banned topics + our banned words)
- Example caption written in their voice (with a hook that earns the second line)

## 3. Content Pillars (4-5)
For each pillar:
- Pillar name
- Purpose: which business goal from the intake it serves
- 3 example post ideas, specific to this client (not generic prompts)
- Target ratio: % of monthly content

Ratios must sum to 100%.

## 4. Creative Direction
- Filming style (handheld/tripod, location specifics from the intake)
- Editing style (captions, cuts, music energy)
- Pacing (target video length, hook timing)
- On-camera vs b-roll balance, based on who is actually willing to be on camera
- References: the accounts they listed they love, plus any we recommend

## 5. Posting Cadence
Recommend a cadence based on their retainer tier (the intake doesn't ask this
directly — check the client's brain folder or ask Ashton if unknown). Current
tiers: Basic $600/mo (4 videos, 1 session), Standard $1,250/mo (8 videos,
2 sessions), Premium $2,750/mo (16 videos, 3 sessions). Use their camera
comfort score and filming days/times as a sanity check, not the driver — flag
it only if comfort is very low (0-3) or their filming availability looks too
thin to hit the tier's session count.

## 6. Conversion Plan
- CTAs matched to their preferred next step (call, DM, book, walk in)
- ManyChat keyword ideas (word + what the flow delivers)
- Lead capture path: post → comment/DM → automation → their booking link,
  website, or phone (the intake doesn't collect this — pull it from the
  client's brain folder, or mark `[PLACEHOLDER: ask client for booking link]`
  if it isn't on file anywhere)

## 7. First 30 Days
- Session 1 shot list: what to film first and why
- First 2 weeks of posts (which pillar, which idea)
- What to set up before posting starts (automation flows, bio, booking link)

## 8. Risks / Watch-outs
Where this specific client might stall (camera shyness, slow approvals,
seasonality, thin offer, unrealistic expectations) and what I do to prevent
each one. Be blunt. This section is never shown to the client.
```

### File 2: `client-strategy.md` (goes to the client)

Same content as sections 1-7, rewritten. Rules:

- Drop section 8 entirely, and strip anything that reads as an internal note, tier mismatch flag, or placeholder marker (resolve or omit instead).
- Address the client directly ("you", "your customers"). We are "we".
- Shockwave Studios voice per `brand_voice.md`: confident, direct, warm. Plain language. Short sentences. No em dashes. No jargon. Contractions always.
- Rename sections in client-friendly language (e.g. "Client Snapshot" becomes "Where You Are Now", "Conversion Plan" becomes "How Followers Become Customers"). Keep the same order.
- Say "Social Media Automation", never "ManyChat".
- End with a "## Next Steps" section: 3-4 numbered steps (confirm the strategy, book the first filming session, what we handle vs what we need from them), closing with the standard CTA energy — one clear action.

## Quality gates before you finish

1. Re-read both docs against `context/brand_voice.md`. Fix violations.
2. Check every number and claim: intake, brain, or placeholder. Nothing invented.
3. Search the client-facing doc for "ManyChat" and em dashes. Both must be absent.
4. The core-value test: could this be sent to a different client unchanged? If yes, go back and make it more specific.
5. Confirm pillar ratios sum to 100% and cadence matches capacity.

Then tell Ashton: where the files are, any placeholders that need client answers, and any mismatch you flagged between their goals, tier, and capacity.
