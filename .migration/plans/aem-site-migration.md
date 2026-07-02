# MongoDB Homepage Migration Plan (Full Migration)

> **Status: Not started.** This is still a plan — no migration work has run yet because plan mode only builds the plan. To actually perform the migration, approve the plan / switch to **Execute mode**, and I'll begin at the first checklist item.

## Objective

Migrate the **MongoDB homepage** (`https://mongodb.com/`) into this AEM Edge Delivery Services (xwalk) project, covering the **full scope**:
- **Content structure** — sections, default content, and blocks authored into AEM
- **Design & styling** — match the original visual design, CSS, and design tokens
- **Navigation & footer** — instrument the header/nav and footer to match the source

## Inputs

| Input | Value |
|-------|-------|
| Source page URL | ✅ `https://mongodb.com/` |
| Migration type | ✅ Single page (homepage) |
| Scope | ✅ Full (content + design + navigation + footer) |

## Approach Overview

1. **Determine project setup** — confirm project type (xwalk) and discover the available block library so we reuse existing blocks before building new ones.
2. **Analyze the source page** — scrape `https://mongodb.com/`, capture the DOM structure, screenshots, section boundaries, and candidate block variants.
3. **Establish design foundation** — extract design tokens (colors, typography, spacing, buttons) from MongoDB and apply them to the global site styles.
4. **Map & build blocks** — map each MongoDB section to an existing project block where possible; create new block variants for anything unmatched, each styled to match.
5. **Generate import infrastructure** — build the page template, block parsers, and page transformers needed for the import pipeline.
6. **Import content** — run the bundled import script to generate authored AEM content (no hand-written HTML).
7. **Instrument navigation & footer** — migrate the MongoDB header/nav (including any mega-menu) and footer using source screenshots as ground truth.
8. **Visually verify** — compare the rendered AEM page against the original and fix discrepancies.

## Checklist

- [ ] Determine project type and available block library (project-expert)
- [ ] Analyze `https://mongodb.com/`: structure, sections, block variants, screenshots (page-analysis)
- [ ] Extract and apply MongoDB design tokens + global site styling (complete-design-expert)
- [ ] Map homepage sections to existing blocks; create new block variants as needed
- [ ] Migrate/verify each block's visual design against the source (block-design-expert)
- [ ] Generate import infrastructure: page template, parsers, transformers (import-infrastructure)
- [ ] Run the bundled import script to generate authored content (content-import)
- [ ] Instrument the header/navigation, including mega-menu, to match MongoDB (navigation-orchestrator)
- [ ] Instrument the footer to match MongoDB (footer-orchestrator)
- [ ] Visually critique the full migrated page vs. original and fix issues (visual-critique)
- [ ] Final review in preview and report results

## Notes

- Content will be produced via the project's import pipeline — **no hand-authored HTML**.
- The MongoDB homepage is a complex, marketing-heavy page (hero, feature grids, logo strips, CTAs, rich mega-menu nav). Expect several new block variants and a non-trivial navigation instrumentation step.
- **Nothing has been executed yet.** Execution requires **Execute mode** — approve this plan and I'll start at the first checklist item.
