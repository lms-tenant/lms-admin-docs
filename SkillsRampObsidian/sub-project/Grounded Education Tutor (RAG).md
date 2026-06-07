# Project 1 — Grounded Education Tutor (RAG) · Build + Learn Plan

A retrieval-grounded course assistant that answers **only** from supplied course material, cites its sources, and refuses when the material doesn't cover the question. The headline of this project is the **evaluation harness** — that's what makes it read as senior-level rather than a tutorial demo.

**How to use this file:** work top to bottom. Each stage has a goal, build steps, and a parallel _Learn_ note so the understanding grows with the code. Don't skip the eval-first thinking in Stage 1 — defining "good" before building is the whole point.

---

## Stage 0 — Foundations & setup

Goal: enough mental model to explain the system, plus a clean repo.

- [ ] Watch Karpathy's _Intro to Large Language Models_ (short overview)
- [ ] Watch Karpathy's _Deep Dive into LLMs like ChatGPT_ (under-the-hood fundamentals)
- [ ] Write a 1-paragraph plain-English explanation of: tokens, embeddings, why LLMs hallucinate (if you can't explain it, rewatch)
- [ ] Create a public GitHub repo with a clear README stub
- [ ] Set up Python env (venv or uv), pin dependencies
- [ ] Decide on LLM provider/model and get API access working with a hello-world call
- [ ] Add `.env` handling + keep secrets out of git

## Stage 1 — Scope & success criteria (eval-first)

Goal: define what "good" means **before** writing the pipeline.

- [ ] Pick a real, bounded corpus (e.g. one course: lecture notes + slides + a textbook chapter set)
- [ ] Write down 3–5 example questions it MUST answer well
- [ ] Write down 3–5 questions it MUST refuse (not covered by the material)
- [ ] Define your target metrics in words: groundedness, retrieval hit-rate, hallucination rate, correct-refusal rate
- [ ] Read Hamel Husain's evals FAQ + "how to evaluate my RAG system" (hamel.dev)
- [ ] Note the key principle: skip generic metrics (ROUGE/BERTScore/cosine) for answer quality — plan for error analysis + custom pass/fail evals

## Stage 2 — Ingestion & chunking

Goal: turn raw documents into clean, well-sized passages.

- [ ] Build a loader for your file types (PDF, slides, notes, transcripts)
- [ ] Parse + clean text (handle headers, tables, page noise)
- [ ] Implement a baseline chunking strategy (fixed-size with overlap)
- [ ] Attach metadata to each chunk (source doc, page/section, position)
- [ ] Eyeball 20–30 chunks manually — are they coherent units?
- [ ] _Learn:_ read up on chunking tradeoffs (too small loses context, too big adds noise) — note why this quietly drives answer quality

## Stage 3 — Embedding & vector store (indexing pipeline)

Goal: a searchable index of your corpus.

- [ ] Choose an embedding model (note: dimensionality, cost, language support)
- [ ] Embed all chunks; store vectors + metadata in a vector store
- [ ] Confirm you can run a similarity query and get sensible chunks back
- [ ] Make indexing re-runnable (idempotent) so you can re-chunk and re-embed easily
- [ ] _Learn:_ DeepLearning.AI _Retrieval Augmented Generation_ (Zain Hasan) — modules on chunking, indexing, and the vector DB

## Stage 4 — Retrieval (baseline → upgraded)

Goal: get the _right_ chunks in front of the LLM. This is where you out-skill demos.

- [ ] Baseline: embed the query, return top-k by similarity
- [ ] Build a small retrieval test set (synthetic: extract facts from your docs, generate the questions those facts answer → query↔document pairs)
- [ ] Measure baseline retrieval hit-rate against that set
- [ ] Add hybrid search (combine semantic vectors + keyword/BM25) — embeddings are bad at exact terms like "Theorem 4.2"
- [ ] Add reranking (retrieve ~20 candidates, reorder with a cross-encoder, keep best few)
- [ ] Re-measure hit-rate; record before/after numbers
- [ ] _Learn:_ same DeepLearning.AI course covers BM25 + Reciprocal Rank Fusion; the "Advanced RAG" short course covers sentence-window & auto-merging retrieval

## Stage 5 — Generation (grounded, cited, honest)

Goal: answers that stay on-source and admit ignorance.

- [ ] Build the prompt: instructions + retrieved chunks + the question
- [ ] Make the model cite which chunk(s) each claim came from
- [ ] Implement refusal behavior: "this isn't covered in your materials" when retrieval is weak/empty
- [ ] Add a groundedness guardrail (post-check that claims trace to retrieved text)
- [ ] Manually test against your Stage 1 must-answer and must-refuse questions
- [ ] _Learn:_ the "RAG triad" framing — Context Relevance, Groundedness, Answer Relevance

## Stage 6 — Evaluation harness (the headline)

Goal: measurable proof the system works, and a loop to improve it.

- [ ] Do error analysis: manually review 20–50 outputs, label failures, group them into failure modes
- [ ] Build an LLM-as-judge for groundedness/answer-quality (binary pass/fail prompts, not generic scores)
- [ ] Validate the judge against your own human labels (does it agree with you?)
- [ ] Add code-based assertions for things that don't need a judge (e.g. "did it cite a source?", "did it refuse when it should?")
- [ ] Wire metrics into a repeatable script (consider RAGAS + Pytest assertions)
- [ ] Produce a metrics table: groundedness, retrieval hit-rate, hallucination rate, correct-refusal rate
- [ ] Re-run after each change so you can show improvement over time
- [ ] _Learn:_ Jason Liu's "There Are Only 6 RAG Evals"; (optional, paid) Hamel + Shreya Shankar's Maven "AI Evals" course

## Stage 7 — Deployment

Goal: something a stranger can click on.

- [ ] Build a minimal UI (chat box + visible citations + refusal display)
- [ ] Deploy to a public URL
- [ ] Add a demo corpus a visitor can actually query
- [ ] Basic logging of queries + retrieved chunks + answers (also feeds Stage 9)
- [ ] Sanity-check cost + latency on real queries

## Stage 8 — Write-up & portfolio packaging

Goal: the artifact that gets interviews.

- [ ] README: what it does, the value prop, architecture diagram, the eval numbers
- [ ] A "what I learned / what broke / what I'd do at 100x scale" section (shows judgment)
- [ ] Document the design decisions: chunking choice, why hybrid + rerank, how you measured quality
- [ ] Short demo video or GIF
- [ ] Link the live URL + clean, readable code

## Stage 9 — (Optional) MLOps layer = Project 3

Goal: turn the eval work into a visible infrastructure story.

- [ ] Run the eval suite automatically in CI (e.g. on every PR)
- [ ] Add an eval gate that fails the build if quality regresses
- [ ] Build a small dashboard: cost / latency / quality over time
- [ ] Add prompt + config versioning so changes are traceable
- [ ] Add tracing/observability for live queries (catch regressions in prod)

---

## Stretch — Project 2 bridge (Real estate agent)

When Project 1 is shipped, reuse what you learned for an agent that calls your existing price-prediction model as a tool and writes a comparable-market-analysis report. Good next learn: _Building Agentic RAG with LlamaIndex_.

## Resource quick-list

- **Foundations:** Karpathy — _Intro to LLMs_, _Deep Dive into LLMs like ChatGPT_ (Zero to Hero series = optional deeper dive)
- **RAG build:** DeepLearning.AI — _Retrieval Augmented Generation_ (Zain Hasan); _Building & Evaluating Advanced RAG Applications_
- **Advanced RAG (later):** Activeloop — _RAG with LlamaIndex_ (Jerry Liu)
- **Evals (your edge):** hamel.dev evals writing; Jason Liu's "6 RAG Evals"; RAGAS framework; (paid) Maven _AI Evals for Engineers & PMs_

## Suggested learning order

Karpathy's two conceptual videos → DeepLearning.AI RAG course (build alongside it) → Hamel's free eval writing → layer RAGAS into your project.