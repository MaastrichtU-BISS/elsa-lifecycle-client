<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

const toast = useToast();
const auth = useAuthStore();

const state = reactive({
    email: undefined,
    password: undefined,
    confirmPassword: undefined
})

const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.email) errors.push({ name: 'email', message: 'Required' })
    if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
        errors.push({ name: 'email', message: 'Invalid email format' })
    }
    if (!state.password) errors.push({ name: 'password', message: 'Required' })
    if (state.password && state.password.length < 6) {
        errors.push({ name: 'password', message: 'Must be at least 6 characters' })
    }
    if (!state.confirmPassword) errors.push({ name: 'confirmPassword', message: 'Required' })
    if (state.confirmPassword && state.confirmPassword !== state.password) {
        errors.push({ name: 'confirmPassword', message: 'Passwords do not match' })
    }
    return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
    try {
        if (!state.email || !state.password || !state.confirmPassword) {
            toast.add({ title: 'Error', description: 'All fields are required', color: 'error' })
            return
        }
        await auth.register(state.email, state.password, state.confirmPassword)
        await auth.init()
        toast.add({ title: 'Registered Succesfully', description: `Welcome ${auth.user.email}`, color: 'success' })
        navigateTo('/lifecycles')
    } catch (e) {
        toast.add({ title: 'Register failed', description: `${e.data.error}`, color: 'error' })
    }
}

</script>

<template>
    <div class="text-center mt-10 mb-4">
        <h1 class="text-2xl font-bold">Register</h1>
        <p class="text-gray-400">Please enter your credentials to register.</p>
        <p class="text-gray-400">Or login with an existing account
            <ULink class="text-primary" to="/auth/login">here</ULink />
        </p>
    </div>
    <div class="flex justify-center">
        <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormField label="Email" name="email">
                <UInput v-model="state.email" />
            </UFormField>

            <UFormField label="Password" name="password">
                <UInput v-model="state.password" type="password" />
            </UFormField>

            <UFormField label="Confirm Password" name="confirmPassword">
                <UInput v-model="state.confirmPassword" type="password" />
            </UFormField>

            <UButton type="submit" class="w-full justify-center">
                Register
            </UButton>
        </UForm>
    </div>
</template>
