import PocketBase, { type AuthRecord } from 'pocketbase';

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();

  const pb = new PocketBase(config.public.pocketBaseUrl);

  const cookie = useCookie<{ token: string; record: AuthRecord }>('pb_auth', {
    path: '/',
    secure: false,
    sameSite: 'strict',
    httpOnly: false,
    maxAge: 604800,
  });

  pb.authStore.save(cookie.value?.token, cookie.value?.record);

  pb.authStore.onChange(() => {
    cookie.value = {
      token: pb.authStore.token,
      record: pb.authStore.record,
    };
  });

  try {
    if (pb.authStore.isValid) {
      await pb.collection('users').authRefresh();
    }
  } catch (_) {
    pb.authStore.clear();
  }

  return {
    provide: { pb },
  };
});
