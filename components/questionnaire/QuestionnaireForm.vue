<script setup lang="ts">

import { parseCedar } from '~/utils/parseCedar';

const props = defineProps<{
    questionnaire: Questionnaire
}>();

function getForm() {
    const form = JSON.parse(props.questionnaire.form);

    const parsedForm = parseCedar(form);

    console.log('Parsed form:', parsedForm);
    return parsedForm;
}

const form = getForm();

</script>

<template>

    <!-- {{ JSON.stringify(questionnaire.form, null, 2) }} -->

</template>