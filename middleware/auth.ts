export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();

  const authId = to.query['authId'];

  if (!authId) {
    return navigateTo('/empty');
  }

  try {
    if (authId === config.guestUserKey) {
      return;
    } else {
      navigateTo('/empty');
    }
  } catch (e) {
    console.log(e);

    return navigateTo('/empty');
  }
});
