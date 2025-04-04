import PocketBase from 'pocketbase';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const pocketBaseUrl = config.public.pocketBaseUrl;
  const systemUserKey = config.systemUserKey;

  const pb = new PocketBase(pocketBaseUrl);

  await pb.collection('users').authWithPassword('system@system.com', systemUserKey);

  return {
    tocken: pb.authStore.token,
    record: pb.authStore.record,
  };
})
