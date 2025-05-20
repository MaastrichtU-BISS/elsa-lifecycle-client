<script setup lang="ts">
import { LifecycleService } from '~/services/lifecycle';
import type { Lifecycle } from '~/utils/types';

const config = useRuntimeConfig();
const lifecycleService = new LifecycleService(config.public.apiBase as string);
const lifecycles = ref<Lifecycle[]>(await lifecycleService.getAllLifecycles());

</script>
<template>
    <div>
        <section>
            <h1 class="text-2xl font-bold mt-8 text-center">Life Cycles</h1>
            <LifecycleTable :lifecycles="lifecycles" />
        </section>
    </div>
</template>