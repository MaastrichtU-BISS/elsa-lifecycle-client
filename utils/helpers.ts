export function isRecommendationDone(
  rec: Recommendation,
  answer: RecommendationAnswer
): boolean {
  return !(rec.Tool?.form && !answer.form) && !(rec.Tool?.url && !answer.file);
}
