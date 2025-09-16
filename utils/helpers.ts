export function isRecommendationDone(
  rec: Recommendation | undefined,
  answer: RecommendationAnswer | undefined
): boolean {
  if (!rec || !answer) return false;

  if (formRequiredButNotProvided(rec, answer)) {
    return false;
  }

  if (fileRequiredButNotProvided(rec, answer)) {
    return false;
  }

  if (nothingRequired(rec) && !answer.checked_done) {
    return false;
  }

  return true;
}

function formRequiredButNotProvided(rec: Recommendation,
  answer: RecommendationAnswer) {
  return !!rec.Tool?.form && !answer.form;
}

function fileRequiredButNotProvided(rec: Recommendation,
  answer: RecommendationAnswer) {
  return rec.Tool?.file_upload && !answer.file;
}

function nothingRequired(rec: Recommendation) {
  return !rec.Tool?.form && !rec.Tool?.file_upload;
}