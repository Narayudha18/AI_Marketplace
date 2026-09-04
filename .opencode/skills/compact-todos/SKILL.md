---
name: compact-todos
description: >
  Universal multi-cycle TODO orchestrator. Drives iterative planning with grill-me
  questioning, manages AGENTS.md checklist, syncs GitHub Project Board #8, supports
  user pause/intervention, enforces Karpathy surgical simplicity, and auto-compacts
  context when threshold exceeded.
  Use when user says "plan feature", "build roadmap", "todo list", "make a plan",
  or invokes /compact-todos.
---

Iterative multi-cycle TODO orchestrator. Trigger + Interaction Engine. Domain skills = Process + Engineering Blueprints.

## Trigger

- `/compact-todos <topic>` — start planning
- "plan feature" / "build roadmap" / "todo list"
- Auto-detects domain skill from workspace or explicit tag

## Architecture: Trigger vs Process

Before generating milestones, determine which **Process Skill Blueprint** to execute:

1. **Explicit Skill Tag**: If topic contains `[fast-prototyping]`, `[karpathy]`, `[devops]`, or `--skill=<name>`, read that skill from `.opencode/skills/<name>/SKILL.md`
2. **Workspace Auto-Detection**: Check `.opencode/skills/` for project-specific skills. Adopt its phase pipeline automatically
3. **General Fallback**: KISS engineering lifecycle (Scaffolding → Architecture → Core Logic → Testing → Deployment)

## Realtime State Machine

Board status syncs to `AGENTS.md` and GitHub Project Board #8:

```
Backlog → Ready → In progress → In review → Done
```

- `Backlog`: Issue exists, planning pending
- `Ready`: Architecture approved
- `In progress`: Implementation active
- `In review`: Paused / awaiting review / tests green
- `Done`: All verified, PR ready/merged

**User Intervention**: User says "stop", "pause", "review" → invoke `compact-todos` with `boardStatus: "In review"`, update AGENTS.md, stop execution.

## Implementation Standards (Karpathy + KISS)

1. **Think Before Coding**: Surface trade-offs explicitly
2. **Simplicity First**: Minimum code that solves the problem
3. **Surgical Precision**: Touch ONLY what was asked. Match existing style
4. **Goal-Driven**: Run tests before and after changes
5. **Educational Comments**: Top-of-file architecture block, 2-3 blank lines between sections

## Cycle Workflow

### Step 1 — Generate Milestone Batch (Grill-Me Frontier)

Provide 1-2 line compact technical overview. For decisions, use Grill-Me format:

```
Q1 - <Title>: <Description>
  [ ] Option A
  [ ] Option B
Recommended: <Option & Rationale>
```

Generate 4-6 concrete, actionable TODO items.

### Step 2 — User Selection

Ask user with checkboxes to pick items from batch.

### Step 3 — Call Tool (Every Cycle)

Add selections to accumulated list. Immediately invoke `compact-todos` tool:

- `topic`: the feature topic
- `todos`: full accumulated list
- `context`: active skill + current phase
- `boardStatus`: "Ready" or "In progress"
- `isFinal`: false

Display tool status to user.

### Step 4 — Continue, Pause, or Finalize

Ask user:
- [ ] **Continue next cycle** — drill deeper
- [ ] **Pause & set In review** — stop and review
- [ ] **its final and exec** — stop grilling, BUILD

### Step 5 — Finalize & Execute

On "its final and exec":

1. Call `compact-todos` with `isFinal: true`, `boardStatus: "In progress"`, COMPLETE list
2. Output finalized plan
3. Branch setup: `git checkout -b feat/F-XXX-name`
4. Implement tasks step-by-step (Karpathy + KISS)
5. Checklist update: invoke `compact-todos` with `completedSteps` or `allCompleted: true`
6. Gatekeeper: invoke `verify-pipeline` → tests pass → `compact-todos` with `boardStatus: "In review"`
7. Create PR → merge → `compact-todos` with `boardStatus: "Done"`

## Tools Integration

| Tool | Purpose |
|------|---------|
| `compact-todos.ts` | AGENTS.md sync, task dedup, auto-compaction |
| `verify-pipeline.ts` | Quality gatekeeper (OpenAPI, Mock JSON, DB, tests) |
| `sync-board.ts` | GitHub Issues + Project Board #8 automation |

## Auto-Clarity

Drop orchestrator mode when:
- Security warnings
- Irreversible action confirmations
- Multi-step sequences where order matters
- User asks to clarify

Resume after clear part done.

## Boundaries

- Only generates plans and orchestrates execution
- Does not git commit directly (user confirms)
- Does not push without explicit request
- Level persists until session end or "stop compact-todos"
