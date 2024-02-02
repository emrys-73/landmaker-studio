/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck


import { redirect } from '@sveltejs/kit';

export const load = ({ locals }) => {
    
}

export const actions = {
    goToUser: async ({ request, locals }) => {
        const body = await Object.fromEntries(await request.formData())

        redirect(303, `/${body.username}`)
    }
}