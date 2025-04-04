export default defineNuxtRouteMiddleware(async(to, from) => {
  const authId = to.query['authId'];

  if (!authId) {
    return navigateTo('/empty');
  }

  try {
    const { data } = await useFetch('/api/guest', { body: { authId }, method: 'post' });

    if (!data.value) {
      return navigateTo('/empty');
    }
  } catch (e) {
    console.log(e);

    return navigateTo('/empty');
  }
});
