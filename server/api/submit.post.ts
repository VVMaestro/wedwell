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

    const pb = new PocketBase(pocketBaseUrl);

    await pb.collection('users').authWithPassword('system@system.com', systemUserKey);

    const guest = await pb.collection('guests').getOne(authId);

    if (!guest) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No guest found by this id',
        });
    }

    await pb.collection('guests').update(authId as string, {
        meal,
        name,
        attending,
        drink,
        comment,
    });
});
