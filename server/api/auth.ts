import PocketBase from 'pocketbase';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const pocketBaseUrl = config.public.pocketBaseUrl;
  const systemUserKey = config.systemUserKey;

  const pb = new PocketBase(pocketBaseUrl);

  await pb.collection('users').authWithPassword('system@system.com', systemUserKey);

  return {
    token: pb.authStore.token,
    record: pb.authStore.record,
  };
})
