<script lang="ts" setup>
import * as z from 'zod';

const emits = defineEmits(['create']);

const newTool = ref({
    title: '',
    description: '',
    url: '',
    cover: undefined as File | undefined,
});

// Define accepted image MIME types
const imageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const imageFileSchema = z
    .custom<File>((file) => {
        return file instanceof File && imageMimeTypes.includes(file.type);
    }, {
        message: "Must be an image file (jpg, png, webp, avif)",
    });

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    url: z.string().url('Invalid URL'),
    cover: imageFileSchema
});

function handleFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    newTool.value.cover = file
  }
}

const onSubmit = () => {
    const formData = new FormData();
    formData.append("title", newTool.value.title);
    formData.append("description", newTool.value.description);
    formData.append("url", newTool.value.url);
    if (newTool.value.cover) {
        formData.append("cover", newTool.value.cover);
    }
    emits("create", formData);

    newTool.value = {
        title: '',
        description: '',
        url: '',
        cover: undefined,
    };
};
</script>

<template>
    <div class="w-fit mx-auto">
        <UForm :schema="schema" :state="newTool" class="space-y-4" @submit="onSubmit">
            <UFormField name="title" label="Title" :required="true">
                <UInput v-model="newTool.title" class="w-full"/>
            </UFormField>
            <UFormField name="description" label="Description" :required="true">
                <UTextarea v-model="newTool.description" class="w-full"/>
            </UFormField>
            <UFormField name="url" label="Url" :required="true">
                <UInput v-model="newTool.url" class="w-full"/>
            </UFormField>
            <UFormField name="cover" label="Cover" :required="true">
                <UInput type="file" accept=".jpeg, .jpg, .webp, .avif" @change="handleFileChange" />
            </UFormField>

            <UButton type="submit">
                Submit
            </UButton>
        </UForm>
    </div>
</template>