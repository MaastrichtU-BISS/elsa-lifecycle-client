<script setup lang="ts">

const props = defineProps<{
    questionnaire: Questionnaire
}>();

</script>

<template>

    {{ JSON.stringify(questionnaire.form, null, 2) }}

</template>