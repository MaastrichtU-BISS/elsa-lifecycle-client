import { ReflectionAnswerGetRecommendations } from "~/utils/types";
import type { ReflectionAnswer, FurtherReflectionAnswer } from "~/utils/types";
import type { JournalService } from "~/services/journal";

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

function formRequiredButNotProvided(
  rec: Recommendation,
  answer: RecommendationAnswer
) {
  return !!rec.Tool?.form && !answer.form;
}

function fileRequiredButNotProvided(
  rec: Recommendation,
  answer: RecommendationAnswer
) {
  return rec.Tool?.file_upload && !answer.file;
}

function nothingRequired(rec: Recommendation) {
  return !rec.Tool?.form && !rec.Tool?.file_upload;
}

export function isGetRecommendationsActive(form: string | undefined): boolean {
  if (!form) return false;
  let parsedForm;
  try {
    parsedForm = JSON.parse(form);
  } catch {
    return false;
  }

  return (
    parsedForm["get_recommendations"] === ReflectionAnswerGetRecommendations.YES
  );
}

export function isReflectionFinished(
  reflectionAnswer: ReflectionAnswer | undefined,
  furtherReflectionAnswer: FurtherReflectionAnswer | undefined
): boolean {
  // No reflection answer at all
  if (!reflectionAnswer?.form) return false;

  let parsedForm;
  try {
    parsedForm = JSON.parse(reflectionAnswer.form);
  } catch {
    return false;
  }

  // Check if first textarea is filled (assuming it's the main reflection answer)
  const hasMainAnswer = Object.keys(parsedForm).some(key => {
    const value = parsedForm[key];
    return typeof value === 'string' && value.trim().length > 0;
  });

  if (!hasMainAnswer) return false;

  // If recommendations were requested, check if further reflection is also filled
  if (isGetRecommendationsActive(reflectionAnswer.form)) {
    if (!furtherReflectionAnswer?.form) return false;

    let parsedFurtherForm;
    try {
      parsedFurtherForm = JSON.parse(furtherReflectionAnswer.form);
    } catch {
      return false;
    }

    // Check if further reflection has answers
    const hasFurtherAnswer = Object.keys(parsedFurtherForm).some(key => {
      const value = parsedFurtherForm[key];
      return typeof value === 'string' && value.trim().length > 0;
    });

    return hasFurtherAnswer;
  }

  return true;
}

export function isPhaseFinished(
  reflectionAnswers: (ReflectionAnswer | undefined)[],
  furtherReflectionAnswers: (FurtherReflectionAnswer | undefined)[]
): boolean {
  // Check if phase has reflections
  if (reflectionAnswers.length === 0) return false;

  // Check if all reflections are finished
  return reflectionAnswers.every((reflectionAnswer, index) => {
    return isReflectionFinished(
      reflectionAnswer,
      furtherReflectionAnswers[index]
    );
  });
}

export async function openPdfInFullscreen(
  journalId: number,
  journalService: JournalService,
  auth: ReturnType<typeof useAuthStore>,
  toast: ReturnType<typeof useToast>,
  reflectionId?: number
) {
  if (!auth.token) {
    toast.add({ title: 'Error', description: 'You need to be logged in!', color: 'error' });
    return;
  }

  try {
    journalService.setToken(auth.token);
    const blob = reflectionId
      ? await journalService.generatePDFByIdForReflection(journalId, reflectionId)
      : await journalService.generatePDFById(journalId);
    const pdfUrl = window.URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    toast.add({ title: 'Error', description: error as string, color: 'error' });
  }
}
