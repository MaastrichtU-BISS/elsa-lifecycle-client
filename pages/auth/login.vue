<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

const toast = useToast();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const state = reactive({
    email: undefined,
    password: undefined
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
    return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>) {
    try {
        if (!state.email || !state.password) {
            toast.add({ title: 'Error', description: 'Email and password are required', color: 'error' })
            return
        }
        await auth.login(state.email, state.password)
        await auth.init()
        toast.add({ title: 'Logged In Succesfully', description: `Welcome ${auth.user.email}`, color: 'success' })

        // Redirect to previous page if available, otherwise go to home
        const redirect = route.query.redirect as string || '/'
        await router.push(redirect)
    } catch (e) {
        toast.add({ title: 'Login failed', description: `${e.data.error}`, color: 'error' })
    }
}

</script>

<template>
    <div>
        <div class="text-center mt-10 mb-4">
            <h1 class="text-2xl font-bold">Login</h1>
            <p class="text-gray-400">Please enter your credentials to login.</p>
        </div>
        <div class="flex justify-center">
            <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Email" name="email">
                    <UInput v-model="state.email" data-testid="login-email" />
                </UFormField>

                <UFormField label="Password" name="password">
                    <UInput v-model="state.password" type="password" data-testid="login-password" />
                </UFormField>

                <UButton type="submit" class="w-full justify-center" data-testid="login-submit">
                    Login
                </UButton>
            </UForm>
        </div>
        <div class="text-center mt-6">
            <ULink class="text-primary underline"
                :to="`/auth/register${route.query.redirect ? '?redirect=' + encodeURIComponent(route.query.redirect as string) : ''}`">
                Or create a new account
            </ULink>
        </div>
    </div>
</template>
