<script lang="ts" setup>
import { ref } from 'vue';
import type { Questionnaire } from '~/utils/types';

const emit = defineEmits(["create"]);

const newQuestionnaire = ref<Omit<Questionnaire, "id">>({
    name: '',
    description: '',
    form: '',
    formName: ''
});

const importTemplate = (event: Event) => {

    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            newQuestionnaire.value.form = content;
            newQuestionnaire.value.formName = file.name;
        };
        reader.readAsText(file);
    }
}

const createQuestionnaire = () => {
    if (newQuestionnaire.value.name && newQuestionnaire.value.description && newQuestionnaire.value.form) {
        emit('create', newQuestionnaire.value);
        newQuestionnaire.value = { name: '', description: '', form: '', formName: '' };
    } else {
        alert("Please fill all fields.");
    }
};

</script>

<template>

    <div class="p-4 border border-gray-300 rounded-lg w-fit">
        <div class="mb-3">
            <label class="mr-3">Name</label>
            <UInput v-model="newQuestionnaire.name" />
        </div>
        <div class="mb-3">
            <label class="mr-3">Description</label>
            <UInput v-model="newQuestionnaire.description" />
        </div>
        <div class="mb-3">
            <label class="mr-3">Form</label>
            <UInput type="file" @change="importTemplate" accept=".json" />
        </div>
        <UButton @click="createQuestionnaire">Create Questionnaire</UButton>
    </div>

</template>