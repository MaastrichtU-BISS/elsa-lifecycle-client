<script setup lang="ts">
import General from '~/components/home/General.vue';
import IntroductionJournal from '~/components/home/IntroductionJournal.vue';
import { QuestionnaireService } from '~/services/questionnaire';
import { AnswerService } from '~/services/answer';
import QuestionnaireForm from '~/components/questionnaire/QuestionnaireForm.vue';
import { RecommendationService } from '~/services/recommendation';
import ToolList from '~/components/tool/ToolList.vue';

const toast = useToast();

const config = useRuntimeConfig();
const questionnaireService = new QuestionnaireService(config.public.apiBase as string);
const answerService = new AnswerService(config.public.apiBase as string);
const recommendationService = new RecommendationService(config.public.apiBase as string);

// const route = useRoute()

const questionnaireId = 1;
const questionnaire = ref<Questionnaire>(await questionnaireService.getQuestionnaireById(questionnaireId));
const answer = ref<Answer | undefined>(questionnaire.value.Answers?.at(0));
const recommendations = ref<Recommendation[]>(answer.value ? await recommendationService.getRecommendations(answer.value.questionnaireId, answer.value.binaryEvaluation) : []);

const recommendedTools = computed(() => {
  const recommendedTools: Tool[] = []
  recommendations.value.forEach(r => recommendedTools.push(r.Tool!));
  return recommendedTools;
});

const createAnswer = async (data: any, binaryEvaluation: number) => {
  try {
    const newAnswer: Omit<Answer, "id"> = {
      questionnaireId: questionnaireId,
      form: JSON.stringify(data),
      binaryEvaluation: binaryEvaluation,
    }
    const response = await answerService.createAnswer(newAnswer, questionnaireId);
    answer.value = response;
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
  } catch (error) {
    toast.add({ title: 'Error', description: error as string, color: 'error' });
    return;
  }
};

const editAnswer = async (data: any, binaryEvaluation: number) => {
  try {
    const newAnswer: Partial<Answer> = {
      form: JSON.stringify(data),
      binaryEvaluation: binaryEvaluation,
    }
    const response = await answerService.editAnswer(newAnswer, answer.value.id);
    answer.value = response;
    recommendations.value = await recommendationService.getRecommendations(answer.value.questionnaireId, answer.value.binaryEvaluation)
    toast.add({ title: 'Success', description: 'The form has been edited.', color: 'success' });
  } catch (error) {
    toast.add({ title: 'Error', description: error as string, color: 'error' });
    return;
  }
}

const createOrEditAnswer = async (data: any, binaryEvaluation: number) => {
  if (answer.value) {
    await editAnswer(data, binaryEvaluation);
  } else {
    await createAnswer(data, binaryEvaluation);
  }
};

const indices = ref([
  {
    label: 'Introduction',
    value: 'introduction',
    defaultExpanded: true,
    children: [
      {
        label: 'General',
        value: 'introduction-general',
        icon: 'i-lucide-info',
        defaultExpanded: true,
      },
      {
        label: 'Journal',
        value: 'introduction-journal',
        icon: 'i-lucide-book-open-text',
        defaultExpanded: true,
      }
    ]
  },
  {
    label: 'Phase 1 - Project Definition / Project Scoping',
    value: 'phase1',
    defaultExpanded: true,
    children: [
      {
        label: 'Reflection',
        value: 'phase1-reflection',
        icon: 'i-lucide-clipboard-pen-line',
        defaultExpanded: true,
      },
      {
        label: 'Recommendations',
        value: 'phase1-recommendations',
        icon: 'i-lucide-wrench',
        defaultExpanded: true,
      },
      {
        label: 'Journal',
        value: 'phase1-journal',
        icon: 'i-lucide-book-open-text',
        defaultExpanded: true,
      }
    ]
  },
]);

const activeIndex = ref(indices.value[0].children[0]);

</script>

<template>
  <section id="content" class="mt-2 mb-8">

    <USlideover :overlay="false" side="left" title="Indices" :ui="{ overlay: 'max-w-sm' }">
      <UButton label="Indices" trailing-icon="i-lucide-square-menu" class="ml-4 fixed left-[1em]" />

      <template #body>
        <UTree v-model="activeIndex" :items="indices" />
      </template>
    </USlideover>

    <div v-show="activeIndex.value == 'introduction-general'" >
      <General />
      <div class="flex justify-end my-4">
        <UButton trailing-icon="i-lucide-arrow-right" size="md" @click="activeIndex = indices[0].children[1]">
          Journal
        </UButton>
      </div>
    </div>
    
    <div v-show="activeIndex.value == 'introduction-journal'">
      <IntroductionJournal />
      <div class="flex justify-between my-8">
        <UButton icon="i-lucide-arrow-left" size="md" @click="activeIndex = indices[0].children[0]">General</UButton>
        <UButton trailing-icon="i-lucide-arrow-right" size="md" @click="activeIndex = indices[1].children[0]">
          Reflection
        </UButton>
      </div>
    </div>
    <div v-show="activeIndex.value == 'phase1-reflection'">
      <QuestionnaireForm :questionnaire="questionnaire" :answer="answer" @on-submit="createOrEditAnswer" />
      <div class="flex justify-between my-8">
        <UButton icon="i-lucide-arrow-left" size="md" @click="activeIndex = indices[0].children[1]">Journal</UButton>
        <UButton trailing-icon="i-lucide-arrow-right" size="md" @click="activeIndex = indices[1].children[1]">
          Recommendations
        </UButton>
      </div>
    </div>
    <div v-show="activeIndex.value == 'phase1-recommendations'">
      <ToolList :tools="recommendedTools" :title="'Recommended Tools'" />
      <div class="flex justify-between my-8">
        <UButton icon="i-lucide-arrow-left" size="md" @click="activeIndex = indices[1].children[0]">Reflection</UButton>
        <UButton trailing-icon="i-lucide-arrow-right" size="md" @click="activeIndex = indices[1].children[2]">Journal
        </UButton>
      </div>
    </div>

  </section>
</template>