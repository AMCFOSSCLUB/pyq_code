import { curriculum2023, Curriculum } from './curriculum-2023';
import { curriculum2027 } from './curriculum-2027';

const CURRICULUMS: Record<number, Curriculum> = {
  2023: curriculum2023,
  2027: curriculum2027,
};

/**
 * Resolves the curriculum for a specific batch year.
 * If no exact match is found, it falls back to the most recent curriculum year before or equal to the batch year.
 */
export function getCurriculumForBatch(batchYear: number): Curriculum {
  const years = Object.keys(CURRICULUMS).map(Number).sort((a, b) => b - a); // descending
  for (const year of years) {
    if (batchYear >= year) {
      return CURRICULUMS[year];
    }
  }
  // Default fallback to 2023
  return curriculum2023;
}
