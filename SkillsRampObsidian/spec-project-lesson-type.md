# Spec: Project Lesson Type — Design Kickoff

> **Status:** Kickoff / Ideation — decisions marked with ❓ require alignment before implementation
> **Scope:** Full lifecycle of a project lesson: creation → submission → review → result → notification
> **Existing context:** The platform already has 5 lesson types (video, PDF, content, project, resource). This spec defines the full design for the `project` type, which may be partially stubbed.

---

## What We're Building

A **Project lesson** is a lesson type where students complete and submit work for instructor review. Unlike video or content lessons (passive consumption), projects are the primary active learning artifact — they validate that a student can apply what they learned.

Key difference from the existing **Exam** type:
- Exams = auto-graded, multiple choice, immediate result
- Projects = manually reviewed by instructor, open-ended deliverable, async feedback loop

---

## 1. Project Creation (Instructor / Admin Side)

### Basic Configuration

When an instructor adds a lesson of type `project`, they configure:

```
Title                   [_______________________________]
Instructions / Brief    [rich text editor — what the student must do]
Deadline                [date picker, optional]
Required to complete    [toggle — must pass to unlock next lesson]
```

### Deliverable Types

What formats can a student submit? The instructor selects one or more allowed types:

| Type | Description | Examples |
|---|---|---|
| **File upload** | Student uploads one or more files | PDF, ZIP, images, .pptx |
| **URL** | Student submits a link | GitHub repo, Figma, live site, Loom video |
| **Text** | Student writes directly in the platform | Short answer, reflection, essay |
| **Video recording** | Student records or uploads a video | Loom, MP4 upload |

❓ **Decision needed:** Do we allow multiple deliverable types per project (e.g. "upload a ZIP AND submit a URL")? Or only one type per project for simplicity?

### File Upload Constraints (if file type is enabled)

```
Allowed file extensions   [PDF, ZIP, PNG, JPG, MP4, PPTX, DOCX — configurable]
Max file size             [dropdown: 5MB / 10MB / 50MB / 100MB]
Max number of files       [1 / 3 / 5 / unlimited]
```

### Attempt Policy

```
Max attempts    [1 / 2 / 3 / 5 / Unlimited]
```

❓ **Decision needed:** What happens when a student exhausts all attempts?
- Option A: They are permanently marked as failed and cannot retry
- Option B: An instructor can manually unlock additional attempts
- Option C: After N attempts, the project auto-fails but the student can still continue the course

**Recommendation:** Option B — instructor unlocks gives flexibility without being too punitive.

### Grading Type

```
○ Pass / Fail
○ Numeric score (0–100)
○ Pass / Fail + Feedback required  ← recommended default
```

❓ **Decision needed:** Do we want a **rubric builder** (checklist of criteria, each scored individually)?
- Simple MVP: Pass/Fail + text feedback
- Future: Rubric with weighted criteria

### Visibility Settings

```
Show submission deadline to students       [toggle]
Show attempt counter to students           [toggle — "Attempt 1 of 3"]
Allow students to see feedback immediately [toggle — or only after instructor sets it]
```

---

## 2. Student Submission Flow

### Submission Page Layout

When a student opens a project lesson, they see:

```
┌────────────────────────────────────────────────────┐
│  📋 Project: [Title]                               │
│  ─────────────────────────────────────────────────  │
│  [Instructions / Brief — rich text]                │
│                                                    │
│  Deadline: May 30, 2026  (3 days left)   ⏰        │
│  Attempts: 1 of 3 used                             │
│  ─────────────────────────────────────────────────  │
│                                                    │
│  YOUR SUBMISSION                                   │
│  [ Upload file ]  or  [ Paste URL ]               │
│                                                    │
│  Add a note to your instructor (optional)         │
│  [_____________________________________________]   │
│                                                    │
│  [ Submit Project ]                               │
└────────────────────────────────────────────────────┘
```

### Submission States (visible to student)

| State | Meaning | UI Treatment |
|---|---|---|
| `draft` | Not yet submitted | Default view, submit button active |
| `submitted` | Sent, awaiting review | "Under review" badge, no resubmit yet |
| `under_review` | Instructor opened it | "Being reviewed" indicator (optional) |
| `approved` | Passed | Green banner + feedback visible |
| `rejected` | Failed, no retry left | Red banner + feedback + next steps |
| `needs_revision` | Instructor requested changes | Orange banner + feedback + resubmit enabled |

### Resubmission

When state is `needs_revision` and attempts remain:
- Student sees instructor feedback prominently
- Previous submission shown for reference
- New submission form is re-enabled
- Attempt counter increments on new submit

### Draft Saving

❓ **Decision needed:** Should the platform auto-save a draft before submission?
- For file uploads: file is stored but not submitted
- For URL/text: content is saved locally or server-side
- **Recommendation:** Yes — prevent accidental loss of work

---

## 3. Instructor Review Flow

### Review Dashboard

Instructors need a way to see pending project reviews. Two entry points:

1. **Course → Lesson → "X pending reviews"** — inline from the course editor
2. **Dedicated review panel** (future) — all pending reviews across all courses

### Review Interface

```
┌────────────────────────────────────────────────────┐
│  Reviewing: [Student Name]                         │
│  Submitted: May 27, 2026 at 3:42pm                │
│  Attempt: 1 of 3                                   │
│  ─────────────────────────────────────────────────  │
│  SUBMISSION                                        │
│  [File preview / URL link / Text content]         │
│                                                    │
│  Student note: "I used the approach from class 3" │
│  ─────────────────────────────────────────────────  │
│  FEEDBACK                                          │
│  [Rich text — comments for the student]           │
│                                                    │
│  RESULT                                            │
│  [ ✅ Approve ]  [ 🔄 Request Revision ]  [ ❌ Reject ] │
└────────────────────────────────────────────────────┘
```

### Review Actions

| Action | Description | Student Result |
|---|---|---|
| **Approve** | Project passes | State → `approved`, lesson marked complete |
| **Request Revision** | Send back with feedback | State → `needs_revision`, resubmit enabled if attempts remain |
| **Reject** | Hard fail, no retry | State → `rejected`, lesson not completed |

❓ **Decision needed:** Should **Reject** be a separate action from "Request Revision with 0 attempts left"? Or should they be unified and the system auto-rejects when attempts are exhausted?

**Recommendation:** Keep them separate. Reject is an intentional instructor decision. Running out of attempts should trigger a different flow (auto-fail or instructor decides).

### Feedback Options

- **Text feedback** (always available)
- **Inline annotations on file** — ❓ Future scope? (PDF annotation is complex)
- **Score** — if grading type is numeric, instructor enters score alongside pass/fail

### Chat / Discussion Thread

❓ **Big design decision:** Do we add a **per-project chat** between student and instructor?

**Option A — Comments only (Recommended for MVP)**
- Async comment thread attached to the submission
- Both student and instructor can add comments
- Simpler, no real-time complexity
- Works like PR comments on GitHub

**Option B — Real-time chat**
- Socket.IO chat per project submission
- Higher complexity, higher value for 1:1 coaching use cases
- Risk: instructors get overwhelmed with messages

**Option C — No chat, feedback only**
- Instructor writes feedback once, student reads it
- Simplest, but no back-and-forth

**Recommendation:** Option A (async comment thread) for V1. Can upgrade to real-time in V2 if demand is there.

---

## 4. Student Result Visualization

After the instructor reviews, the student's project page transforms into a results view:

### Approved

```
┌────────────────────────────────────────────────────┐
│  ✅ Project Approved                               │
│  Reviewed by: [Instructor Name] on May 28, 2026   │
│  ─────────────────────────────────────────────────  │
│  INSTRUCTOR FEEDBACK                               │
│  [Instructor's feedback text]                      │
│  ─────────────────────────────────────────────────  │
│  YOUR SUBMISSION (read-only)                       │
│  [File / URL / Text — view only]                  │
│                                                    │
│  [ Continue to next lesson → ]                    │
└────────────────────────────────────────────────────┘
```

### Needs Revision

```
┌────────────────────────────────────────────────────┐
│  🔄 Revision Requested                             │
│  Attempts remaining: 2                             │
│  ─────────────────────────────────────────────────  │
│  INSTRUCTOR FEEDBACK                               │
│  [What needs to change]                            │
│  ─────────────────────────────────────────────────  │
│  YOUR PREVIOUS SUBMISSION (for reference)          │
│  [View previous submission]                        │
│                                                    │
│  NEW SUBMISSION                                    │
│  [Upload / URL / Text field — enabled]            │
│  [ Submit Revision ]                              │
└────────────────────────────────────────────────────┘
```

### Rejected / Failed

```
┌────────────────────────────────────────────────────┐
│  ❌ Project Not Approved                           │
│  You have used all your attempts.                  │
│  ─────────────────────────────────────────────────  │
│  INSTRUCTOR FEEDBACK                               │
│  [Feedback text]                                   │
│  ─────────────────────────────────────────────────  │
│  ❓ Need more attempts? Contact your instructor.  │
└────────────────────────────────────────────────────┘
```

### Submission History

Students should be able to see the full history of attempts:

```
Attempt 1 — May 25  →  🔄 Revision requested
Attempt 2 — May 27  →  ✅ Approved
```

This is motivating and provides transparency.

---

## 5. Notifications

### Student Notifications

| Trigger | Channel | Message |
|---|---|---|
| Project reviewed (approved) | Email + in-app | "Your project was approved! 🎉" |
| Project reviewed (needs revision) | Email + in-app | "Your instructor sent feedback on your project" |
| Project reviewed (rejected) | Email + in-app | "Your project submission has been reviewed" |
| Deadline approaching (24h before) | Email + in-app | "Your project deadline is tomorrow" |
| Instructor commented | In-app (if chat enabled) | "[Instructor] replied to your project" |

### Instructor Notifications

| Trigger | Channel | Message |
|---|---|---|
| New project submitted | Email + in-app | "[Student] submitted a project for review in [Course]" |
| Student resubmitted | In-app | "[Student] submitted a revision" |

❓ **Decision needed:** Should instructors get an email per submission or a daily digest? For courses with many students, per-submission email becomes noisy fast.

**Recommendation:** In-app notification always. Email = configurable per instructor (immediate / daily digest / off).

---

## 6. Course Completion Logic

### Does a project gate the next lesson?

When `required_to_complete = true`:
- Student cannot move to the next lesson until the project is `approved`
- ❓ What about while `submitted` or `under_review`? Can they continue or are they locked?
  - **Recommendation:** Allow progression while under review, but mark the lesson incomplete. Lock final completion/certificate until approved.

### Impact on certificates

- Certificate is not issued until all required lessons (including projects) are `approved`
- If a project has `required_to_complete = false`, it is optional and doesn't block the certificate

---

## 7. Data Model (Draft)

### `ProjectSubmission` entity

```typescript
{
  id: uuid
  lessonId: uuid               // FK → Lesson (type = project)
  studentId: uuid              // FK → User
  tenantId: uuid               // multi-tenant scope
  attemptNumber: number        // 1, 2, 3...

  // Deliverable
  deliverableType: enum        // 'file' | 'url' | 'text' | 'video'
  fileUrl: string | null       // S3/CDN path
  submittedUrl: string | null  // for URL type
  textContent: string | null   // for text type
  studentNote: string | null   // optional note to instructor

  // Review
  status: enum                 // 'submitted' | 'under_review' | 'approved' | 'needs_revision' | 'rejected'
  reviewedBy: uuid | null      // FK → User (instructor)
  reviewedAt: Date | null
  instructorFeedback: string | null
  score: number | null         // if grading type is numeric

  createdAt: Date
  updatedAt: Date
}
```

### `Lesson` entity — new fields for project type

```typescript
{
  // existing fields...

  // Project-specific (only relevant when type = 'project')
  projectDeliverableTypes: string[]      // ['file', 'url']
  projectMaxAttempts: number | null      // null = unlimited
  projectGradingType: enum               // 'pass_fail' | 'numeric'
  projectMaxFileSizeMb: number | null
  projectAllowedExtensions: string[]     // ['pdf', 'zip', 'png']
  projectRequiredToComplete: boolean     // gates next lesson
  projectDeadline: Date | null
  projectShowAttemptCounter: boolean
  projectShowDeadline: boolean
}
```

---

## 8. Open Questions — Decisions Needed Before Implementation

| # | Question | Options | Recommendation |
|---|---|---|---|
| 1 | Multiple deliverable types per project? | One type only / Multiple allowed | One type per project (simpler) |
| 2 | What happens when attempts are exhausted? | Auto-fail / Instructor unlocks more | Instructor unlocks |
| 3 | Rubric builder in V1? | Yes / No | No — Pass/Fail + feedback for MVP |
| 4 | Chat vs. comments vs. feedback only? | Real-time chat / Async comments / No chat | Async comments for V1 |
| 5 | Can students progress while project is under review? | Yes / No | Yes — lock certificate, not progression |
| 6 | Instructor email notifications: per submission or digest? | Immediate / Daily digest / Off | Configurable per instructor |
| 7 | Draft saving for submissions? | Yes / No | Yes |
| 8 | Peer review (students review each other)? | Yes / No | Out of scope for V1 |
| 9 | Submission deadline enforcement: hard block or warning? | Hard block / Warning only | Warning only — instructor decides |
| 10 | Can admin review projects, or only assigned instructor? | Admin + instructor / Instructor only | Both — any admin/instructor of the tenant |

---

## 9. Out of Scope (V1)

- **Peer review** — students reviewing each other's work
- **PDF inline annotation** — highlighting and commenting directly on uploaded PDFs
- **Plagiarism detection** — automated similarity checking
- **Rubric builder** — weighted criteria grading
- **Group projects** — multiple students submitting one project
- **Real-time chat** — per-project messaging (use async comments instead)
- **AI grading assist** — Claude reviewing the submission before instructor sees it

---

## 10. Implementation Phases

### Phase 1 — MVP (Ship first)
- Project lesson creation with basic config (instructions, deadline, max attempts, deliverable type)
- Student submission: file upload + URL + text
- Instructor review: Approve / Request Revision / Reject + text feedback
- Student result page (all 3 states)
- Email notification on review

### Phase 2
- Async comment thread per submission
- Submission history timeline
- In-app notifications
- Instructor review dashboard (pending reviews across courses)
- Draft saving

### Phase 3
- Numeric scoring
- Deadline enforcement + reminders
- Instructor email preferences (immediate / digest)
- Rubric builder

---

## References

- [[spec-plan-billing-features.md]] — plan feature flags (project lesson type should be gated by plan)
- `lms-backend` — existing `Lesson` entity and `LessonType` enum
- `lms-frontend` — existing lesson viewer components to extend
