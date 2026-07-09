// src/frontend/utils/curriculum.ts
// Batch year → curriculum version mapping.
// When a new curriculum arrives (e.g. 2027), add it here — nothing else changes.

import { SUBJECTS } from '@/frontend/data/subjects';

export type SubjectEntry = { code: string; title: string };

// ── Curriculum registry ──────────────────────────────────────────────
// Key = first batch year that uses this curriculum.
// Values = subject list for that curriculum.
const CURRICULUM_REGISTRY: Record<number, SubjectEntry[]> = {
  2023: SUBJECTS, // 2023 curriculum applies to batches 2023, 2024, 2025, 2026
  // 2027: SUBJECTS_2027,  ← drop in when ready; batches 2027+ auto-use it
};

/**
 * Returns the correct subject list for a student's batch year.
 *
 * Logic: find the largest curriculum year that is ≤ joinYear.
 * e.g. joinYear=2024 → uses 2023 curriculum
 *      joinYear=2027 → uses 2027 curriculum (once added)
 *      joinYear=2022 → falls back to earliest available (2023)
 */
export function getSubjectsForBatch(joinYear: number): SubjectEntry[] {
  const cutoffs = Object.keys(CURRICULUM_REGISTRY)
    .map(Number)
    .sort((a, b) => b - a); // descending [2027, 2023, ...]

  for (const cutoff of cutoffs) {
    if (joinYear >= cutoff) return CURRICULUM_REGISTRY[cutoff];
  }

  // Fallback: return earliest curriculum
  const earliest = Math.min(...cutoffs);
  return CURRICULUM_REGISTRY[earliest];
}

/**
 * Fuzzy-search subjects by title within a given curriculum.
 * Returns up to `limit` results, sorted by match quality.
 *
 * Used by UploadForm autocomplete.
 */
export function searchSubjectsByTitle(
  query: string,
  joinYear: number,
  limit = 6
): SubjectEntry[] {
  if (!query.trim()) return [];

  const subjects = getSubjectsForBatch(joinYear);
  const q = query.toLowerCase().trim();

  return subjects
    .map((s) => {
      const title = s.title.toLowerCase();
      let score = 0;
      if (title === q)            score = 100;
      else if (title.startsWith(q)) score = 80;
      else if (title.includes(q)) score = 60;
      else {
        // word-level matching — "data algo" matches "Data Structures and Algorithms"
        const words = q.split(/\s+/).filter(Boolean);
        const hits = words.filter((w) => title.includes(w)).length;
        score = hits > 0 ? (hits / words.length) * 40 : 0;
      }
      return { s, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ s }) => s);
}

/** All available batch years shown in the upload form dropdown. */
const CURRENT_YEAR = new Date().getFullYear();
export const BATCH_YEARS = Array.from(
  { length: CURRENT_YEAR - 2019 + 1 },
  (_, i) => CURRENT_YEAR - i
);