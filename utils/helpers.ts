export function isRecommendationDone(
  rec: Recommendation | undefined,
  answer: RecommendationAnswer | undefined
): boolean {
  if(!rec || !answer) {
    return false;
  }
  return !(rec.Tool?.form && !answer.form) && !(rec.Tool?.url && !answer.file);
}
