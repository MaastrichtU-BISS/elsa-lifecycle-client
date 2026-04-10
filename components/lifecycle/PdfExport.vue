<script setup lang="ts">
import { LifecycleService } from "~/services/lifecycle";
import { openPdfInFullscreen } from "~/utils/helpers";

const props = defineProps<{
    lifecycleId: number;
    lifecycleTitle: string;
    active: boolean;
}>();

const auth = useAuthStore();
const toast = useToast();
const config = useRuntimeConfig();

const lifecycleService = new LifecycleService(config.public.apiBase);

const pdfPreviewUrl = ref<string | null>(null);
const pdfPreviewLoading = ref(false);

const setPdfPreviewFromBlob = (blob: Blob) => {
    if (pdfPreviewUrl.value) {
        window.URL.revokeObjectURL(pdfPreviewUrl.value);
    }
    pdfPreviewUrl.value = window.URL.createObjectURL(blob);
};

const loadPdfPreview = async () => {
    if (pdfPreviewLoading.value || !auth.token) return;

    lifecycleService.setToken(auth.token);
    pdfPreviewLoading.value = true;
    try {
        const blob = await lifecycleService.generatePDFById(props.lifecycleId);
        setPdfPreviewFromBlob(blob);
    } catch {
        // silent — download button still works
    } finally {
        pdfPreviewLoading.value = false;
    }
};

const exportLifecycle = async () => {
    if (!auth.token) {
        toast.add({ title: 'Error', description: 'You need to be logged in!', color: 'error' });
        return;
    }

    try {
        if (!pdfPreviewUrl.value) {
            lifecycleService.setToken(auth.token);
            const blob = await lifecycleService.generatePDFById(props.lifecycleId);
            pdfPreviewUrl.value = window.URL.createObjectURL(blob);
        }

        const link = document.createElement('a');
        link.href = pdfPreviewUrl.value!;
        link.download = `${props.lifecycleTitle}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        toast.add({ title: 'Error', description: error as string, color: 'error' });
    }
};

const openPdfFullscreen = async () => {
    await openPdfInFullscreen(props.lifecycleId, lifecycleService, auth, toast);
};

watch(
    () => props.active,
    (isActive, wasActive) => {
        if (isActive && !wasActive) {
            loadPdfPreview();
        }
    },
    { immediate: true }
);

onUnmounted(() => {
    if (pdfPreviewUrl.value) window.URL.revokeObjectURL(pdfPreviewUrl.value);
});
</script>

<template>
    <div v-if="pdfPreviewLoading" class="flex justify-center items-center h-96">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl" />
    </div>
    <iframe v-else-if="pdfPreviewUrl" :src="pdfPreviewUrl" class="w-full h-[75vh] border rounded-lg mb-6" />

    <div class="flex justify-center gap-4 mt-4">
        <UButton 
        label="See in fullscreen" icon="i-lucide-maximize" size="lg" variant="solid" :disabled="!pdfPreviewUrl"
            @click="openPdfFullscreen" />
        <UButton 
        label="Export as PDF" icon="i-lucide-download" size="lg" variant="solid"
            @click="exportLifecycle" />
    </div>
</template>
