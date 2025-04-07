import PocketBase from 'pocketbase';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ authId: string; }>(event);

  const config = useRuntimeConfig();

  const pocketBaseUrl = config.public.pocketBaseUrl;
  const systemUserKey = config.systemUserKey;
  const authId = body.authId;

  if (!authId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Auth id must be provided'
    });
  }

  const pb = new PocketBase(pocketBaseUrl);

  await pb.collection('users').authWithPassword('system@system.com', systemUserKey);

  const guest = await pb.collection('guests').getOne(authId);

  return guest;
})
