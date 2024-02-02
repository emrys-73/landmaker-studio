/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { getImageURL } from '$lib/utils.ts';

export const load = async ({ locals, params }) => {
    const getUser = async () => {
        try {
            const user = await locals.pb.collection('2_lm_prospects').getFirstListItem(`username="${params.username}"`)

            user.cover_url = user?.cover ?  getImageURL(user.collectionId, user.id, user.cover) : undefined

            user.bg_image_url = user?.bg_image ? getImageURL(user.collectionId, user.id, user.bg_image) : undefined

            // console.log(user)

            return user;

        } catch (error) {
            console.log("Error retrieving user")
        }
    }

    return {
        user: await getUser(),
    }
}
