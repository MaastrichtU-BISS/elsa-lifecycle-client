import { ReflectionAnswerGetRecommendations } from "~/utils/types";
import type { LifecycleService } from "~/services/lifecycle";

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

export async function openPdfInFullscreen(
  lifecycleId: number,
  lifecycleService: LifecycleService,
  auth: ReturnType<typeof useAuthStore>,
  toast: ReturnType<typeof useToast>,
  phaseId?: number
) {
  if (!auth.token) {
    toast.add({ title: 'Error', description: 'You need to be logged in!', color: 'error' });
    return;
  }

  try {
    lifecycleService.setToken(auth.token);
    const blob = phaseId
      ? await lifecycleService.generatePDFByIdForPhase(lifecycleId, phaseId)
      : await lifecycleService.generatePDFById(lifecycleId);
    const pdfUrl = window.URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    toast.add({ title: 'Error', description: error as string, color: 'error' });
  }
}
