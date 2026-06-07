# User Flows

> **Purpose:** Documents end-to-end user journeys through CareerForge workflows with step-by-step descriptions and Mermaid flowcharts.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Business Analyst

---

## 1. Setup Flow (Onboarding)

The user sets up their professional profile for the first time.

```mermaid
flowchart TD
    START([User runs /setup]) --> CHECK{Documents folder<br/>has files?}
    
    CHECK -->|Yes| RECOMMEND[Present 3 paths<br/>Path A recommended]
    CHECK -->|No| PRESENT[Present 3 paths<br/>Path A as populate-first option]
    
    RECOMMEND --> CHOOSE{User chooses path}
    PRESENT --> CHOOSE
    
    CHOOSE -->|Path A| INVENTORY[Scan documents folder]
    CHOOSE -->|Path B| IMPORT[Read pasted/referenced CV]
    CHOOSE -->|Path C| INTERVIEW[Walk through 9 sections]
    
    INVENTORY --> READ_EXISTING[Read existing profile files]
    READ_EXISTING --> PARSE[Parse all documents]
    PARSE --> XREF{Cross-reference<br/>check}
    
    XREF -->|Issues found| RESOLVE[Present issues for resolution]
    XREF -->|No issues| CLASSIFY[Build change sets]
    RESOLVE --> CLASSIFY
    
    CLASSIFY --> ADDITIVE[Present additive changes]
    ADDITIVE --> CONFIRM_ADD{User confirms}
    CONFIRM_ADD --> CONFLICT{Conflicting<br/>changes?}
    
    CONFLICT -->|Yes| RESOLVE_EACH[Resolve each conflict<br/>keep/replace/manual]
    CONFLICT -->|No| GAPS[Ask follow-up for gaps]
    RESOLVE_EACH --> GAPS
    
    IMPORT --> EXTRACT[Extract structured data]
    EXTRACT --> FOLLOWUP[Ask follow-up questions]
    FOLLOWUP --> GENERATE
    
    INTERVIEW --> S1[Identity & Contact]
    S1 --> S2[Education]
    S2 --> S3[Experience]
    S3 --> S4[Technical Skills]
    S4 --> S5[Publications/Awards?]
    S5 --> S6[Behavioral Profile?]
    S6 --> S7[Career Goals]
    S7 --> S8[References?]
    S8 --> S9[Search Configuration]
    S9 --> GENERATE
    
    GAPS --> GENERATE[Generate/update profile files]
    GENERATE --> SUMMARY([Present summary + next steps])
```

---

## 2. Job Search Flow

The user searches for matching job postings.

```mermaid
flowchart TD
    START([User runs /search]) --> LOAD[Load seen jobs +<br/>tracker + queries]
    
    LOAD --> SEARCH[Execute web searches<br/>across portals]
    
    SEARCH --> FETCH[Fetch promising results]
    FETCH --> DEDUP{Already seen<br/>or applied?}
    
    DEDUP -->|Yes| SKIP[Skip, add to seen list]
    DEDUP -->|No| FIT[Quick fit assessment<br/>High/Medium/Low]
    
    SKIP --> MORE{More results?}
    FIT --> MORE
    
    MORE -->|Yes| FETCH
    MORE -->|No| STORE[Update seen_jobs.json]
    
    STORE --> PRESENT[Present results table<br/>sorted by fit]
    
    PRESENT --> ASK{User picks a job?}
    ASK -->|Yes, number N| APPLY([Hand off to /apply])
    ASK -->|No| END([Done])
```

---

## 3. Application Flow (Drafter-Reviewer Pipeline)

The core value workflow for producing tailored applications.

```mermaid
flowchart TD
    START([User runs /apply URL or text]) --> PARSE[Parse job posting<br/>Extract company, role, language]
    
    PARSE --> EVAL[Evaluate fit<br/>5 dimensions + salary]
    EVAL --> PRESENT[Present evaluation<br/>with verdict]
    
    PRESENT --> GATE{User approves<br/>drafting?}
    GATE -->|No| STOP([Stop])
    GATE -->|Yes| DRAFT[Draft CV + Cover Letter<br/>in LaTeX]
    
    DRAFT --> SPAWN[Spawn reviewer agent<br/>Pass drafts inline]
    
    SPAWN --> RESEARCH[Reviewer: Research company]
    RESEARCH --> CRITIQUE[Reviewer: Critique drafts<br/>Part A edits + Part B narrative]
    
    CRITIQUE --> APPLY_A[Drafter: Apply Part A edits]
    APPLY_A --> APPLY_B[Drafter: Apply Part B suggestions<br/>Verify company claims]
    
    APPLY_B --> COMPILE[Compile PDFs<br/>lualatex CV, xelatex cover letter]
    
    COMPILE --> INSPECT{Layout OK?}
    INSPECT -->|No| FIX[Fix LaTeX issues<br/>needspace, enlargethispage,<br/>relevance-weighted cutting]
    FIX --> COMPILE
    
    INSPECT -->|Yes| CLEANUP[Delete build artifacts]
    CLEANUP --> VERIFY[Run verification checklist]
    VERIFY --> FINAL([Present final output<br/>+ tailoring summary])
```

---

## 4. Competency Expansion Flow

The user enriches their profile from additional sources.

```mermaid
flowchart TD
    START([User runs /expand]) --> READ[Read existing profile files]
    
    READ --> SCAN_DOC[Scan documents folder]
    SCAN_DOC --> SCAN_GH[Scan GitHub repositories]
    SCAN_GH --> SCAN_URL[Scan other profile URLs]
    
    SCAN_URL --> ENRICH[Web enrichment<br/>Direct lookup + inference]
    
    ENRICH --> MAP[Build deduplicated<br/>competency map]
    MAP --> REMOVE[Remove items already<br/>in profile]
    
    REMOVE --> PRESENT[Present grouped summary<br/>to user]
    
    PRESENT --> CONFIRM{User confirms?}
    CONFIRM -->|All| WRITE[Write all additions]
    CONFIRM -->|Review| WALK[Walk through each group]
    CONFIRM -->|Skip| CANCEL([Cancel])
    CONFIRM -->|Selective| PARTIAL[Write selected groups]
    
    WALK --> WRITE
    PARTIAL --> WRITE
    
    WRITE --> REPORT([Summary report])
```

---

## 5. Skill Gap Analysis Flow

The user analyzes gaps between their profile and target roles.

```mermaid
flowchart TD
    START([User runs /upskill]) --> MODE{URL argument?}
    
    MODE -->|No URL| AGG[Aggregate mode<br/>Load tracker + profile]
    MODE -->|URL provided| TGT[Targeted mode<br/>Fetch posting + profile]
    
    AGG --> PASS1_A[Pass 1: Hard skill diff<br/>Frequency × fit-weight scoring]
    TGT --> PASS1_T[Pass 1: Hard skill diff<br/>Required vs. preferred]
    
    PASS1_A --> PASS2[Pass 2: LLM synthesis<br/>Domain, soft, tooling, credential gaps]
    PASS1_T --> PASS2
    
    PASS2 --> HEATMAP[Build gap heatmap<br/>Critical/High/Medium/Low]
    HEATMAP --> PRINT[Print heatmap to terminal]
    
    PRINT --> LEARN[Build learning plan<br/>Web search for resources]
    LEARN --> ORDER[Suggest study order<br/>Dependency-aware sequencing]
    
    ORDER --> DELTA{Previous report<br/>exists?}
    DELTA -->|Yes, aggregate| DIFF[Show gaps closed +<br/>new gaps since last]
    DELTA -->|No| SAVE
    
    DIFF --> SAVE[Save report to<br/>upskill/ directory]
    SAVE --> DONE([Report saved])
```

---

## 6. Reset Flow

The user clears profile data to start fresh.

```mermaid
flowchart TD
    START([User runs /reset]) --> SCOPE{Scope provided?}
    
    SCOPE -->|No| ASK[Ask: profile, documents, or all?]
    SCOPE -->|Yes| SHOW
    ASK --> SHOW[Show exactly what<br/>will be cleared]
    
    SHOW --> CONFIRM{User types RESET?}
    CONFIRM -->|No| CANCEL([Cancelled, nothing changed])
    CONFIRM -->|RESET| EXECUTE
    
    EXECUTE --> PROFILE{Profile scope?}
    PROFILE -->|Yes| CLEAR_PROFILE[Replace profile files<br/>with blank templates]
    PROFILE -->|No| DOC_CHECK
    
    CLEAR_PROFILE --> DOC_CHECK{Documents scope?}
    DOC_CHECK -->|Yes| CLEAR_DOCS[Delete document files<br/>Preserve folders + README]
    DOC_CHECK -->|No| SUMMARY
    
    CLEAR_DOCS --> SUMMARY[Report what was cleared]
    SUMMARY --> NEXT([Suggest next steps])
```

---

## 7. First-Time User Journey (Happy Path)

End-to-end from first use to first application submitted.

```mermaid
flowchart LR
    FORK[Fork repo] --> INSTALL[Install dependencies]
    INSTALL --> SETUP[/setup<br/>Choose Path A, B, or C]
    SETUP --> EXPAND[/expand<br/>Enrich from GitHub etc.]
    EXPAND --> SEARCH[/search<br/>Find matching jobs]
    SEARCH --> PICK[Pick high-fit match]
    PICK --> APPLY[/apply<br/>Full pipeline runs]
    APPLY --> REVIEW[Review CV + cover letter PDFs]
    REVIEW --> SUBMIT[Submit application manually]
    SUBMIT --> TRACK[Update status in /dashboard]
    TRACK --> UPSKILL[/upskill<br/>Analyze gaps periodically]
```

---

## 8. Tracking Dashboard Flow

The user reviews their pipeline and updates application status after submitting or hearing back.

```mermaid
flowchart TD
    START([User runs /dashboard]) --> BIND[Bind 127.0.0.1<br/>discover free port]
    BIND --> URL[Print localhost URL<br/>open browser unless --no-open]

    URL --> LOAD[Load job_search_tracker.csv<br/>migrate last_updated if missing]
    LOAD --> RENDER[Render list view<br/>+ KPI strip<br/>+ filter controls]

    RENDER --> ACTION{User action}

    ACTION -->|Type in search| FILTER[Filter rows in place<br/>update URL query state]
    ACTION -->|Change status| GUARD{Allowed<br/>transition?}
    ACTION -->|Edit notes| SAVE_NOTES[Save notes + last_updated]
    ACTION -->|Click row| DRAWER[Open detail drawer<br/>links to CV/CL PDFs]
    ACTION -->|+ New| FORM[Manual append form<br/>required: date/company/role/status]
    ACTION -->|Done| CLOSE([Ctrl+C → shutdown])

    GUARD -->|No| REJECT[HTTP 422<br/>revert UI + toast error]
    GUARD -->|Yes| SAVE_STATUS[Atomic CSV write<br/>tempfile + fsync + rename<br/>retain .bak]

    SAVE_NOTES --> TOAST[Toast: Updated · HH:MM]
    SAVE_STATUS --> TOAST
    REJECT --> RENDER
    TOAST --> RENDER

    DRAWER -->|Esc| RENDER
    FORM --> APPEND{Required<br/>fields valid?}
    APPEND -->|No| FORM
    APPEND -->|Yes| WRITE_NEW[Atomic append<br/>empty cv_file/cover_letter_file]
    WRITE_NEW --> RENDER

    FILTER --> RENDER
```

**Key behaviors:**
- Read-only mode (`--read-only`) disables all mutating controls; reaching a `PATCH` or `POST` route returns HTTP 403.
- Concurrent `/apply` appends compose safely with dashboard edits via the atomic rename contract (NFR-0016).
- Closing the terminal stops the server — no daemon, no persistent state outside the CSV.
