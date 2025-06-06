<script lang="ts" setup>
import type { Recommendation } from '~/utils/types';

const props = defineProps<{
    recommendations: Recommendation[]
}>();

</script>

<template>
    <ToolList :tools="recommendations.map(r => r.Tool!)" :recommendations="recommendations"/>
</template>