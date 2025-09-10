export function isRecommendationDone(
  rec: Recommendation | undefined,
  answer: RecommendationAnswer | undefined
): boolean {
  if (!rec || !answer) return false;

  return (!!rec.Tool?.form && !answer.form) || (rec.Tool?.file_upload && !answer.file) || answer.checked_done;
}
