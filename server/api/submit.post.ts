import PocketBase from 'pocketbase';
import { IForm } from "~/types/IForm";

export default defineEventHandler(async (event) => {
    const {
        authId,
        attending,
        meal,
        name,
        drink,
        comment,
    } = await readBody<IForm & {authId: string;}>(event);

    if (!authId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Auth id must be provided',
        });
    }

    const config = useRuntimeConfig();

    const pocketBaseUrl = config.public.pocketBaseUrl;
    const systemUserKey = config.systemUserKey;
    const guestUserKey = config.guestUserKey;

    if (guestUserKey !== authId) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Wrong auth',
        });
    }

    const pb = new PocketBase(pocketBaseUrl);

    await pb.collection('users').authWithPassword('system@system.com', systemUserKey);

    await pb.collection('guests').create({
        meal,
        name,
        attending,
        drink,
        comment,
    });
});
