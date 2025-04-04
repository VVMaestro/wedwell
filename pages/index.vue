<script setup lang="ts">
  import { HeartIcon, CalendarIcon, MapPinIcon } from 'lucide-vue-next';
  import { 
    YandexMap,
    YandexMapDefaultFeaturesLayer, 
    YandexMapDefaultSchemeLayer, 
    YandexMapDefaultMarker,
    YandexMapListener,
  } from 'vue-yandex-maps';
  import type { LngLat } from '@yandex/ymaps3-types';
  import { z } from 'zod';
  import PocketBase from 'pocketbase';

  definePageMeta({
    middleware: ['auth'],
  });

  const params = useRoute().query;

  const authId = params['authId'];

  const nuxtApp = useNuxtApp();

  const firstCoords: LngLat = [65.56256758019137, 57.13613331616409];
  const secondCoords: LngLat = [65.38411343817563, 57.27367554542644];

  const coordinates = ref(firstCoords);
  const zoom = ref(16);

  interface IForm {
    name: string;
    attending: boolean;
    meal: string;
  }

  const form = reactive<IForm>({
    name: '',
    attending: true,
    meal: '',
  });

  const scroll = ref(0);

  const handleScroll = () => {
    scroll.value = window.scrollY;
  };

  const MS_IN_DAY = 86_400_000;
  const MS_IN_HOUR = 3_600_000;
  const MS_IN_MINUTE = 60000;
  const MS_IN_SECOND = 1000;

  const epochLeft = ref(0);
  let timer: number | null = null;

  const daysLeft = computed(() => Math.floor(epochLeft.value / MS_IN_DAY));
  const hoursLeft = computed(() => Math.floor((epochLeft.value - daysLeft.value * MS_IN_DAY) / MS_IN_HOUR));
  const minutesLeft = computed(() => Math.floor((epochLeft.value - daysLeft.value * MS_IN_DAY - hoursLeft.value * MS_IN_HOUR) / MS_IN_MINUTE));
  const secondsLeft = computed(() => Math.floor((epochLeft.value - daysLeft.value * MS_IN_DAY - hoursLeft.value * MS_IN_HOUR - minutesLeft.value * MS_IN_MINUTE) / MS_IN_SECOND))

  const startTimer = () => {
    epochLeft.value = Math.max(Date.UTC(2025, 5, 11, 11, 0, 0, 0) - Date.now(), 0);

    // @ts-ignore:disable-next-line
    timer = setInterval(() => {
      if (epochLeft.value > 0) {
        epochLeft.value -= 1000;
      } else {
        stopTimer();
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const submitForm = async (form: IForm) => {
    const { meal, name, attending } = form;
    const nuxtApp = useNuxtApp();

    await nuxtApp.$pb.collection('guests').update(authId as string, { meal, name, attending });
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    startTimer();
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
    stopTimer();
  });
</script>

<template>
  <main class="flex min-h-screen flex-col">
    <section class="relative flex flex-col items-center min-h-screen overflow-hidden py-16">
      <div class="absolute inset-0 z-0">
        <nuxt-img 
          src="/P6084338.JPG"
          width="1920"
          height="1080"
          quality="80"
          alt="Wedding background"
          class="opacity-80 object-cover w-[1920px] h-[1080px]"
          densities="x1 x2"
        />
      </div>

      <div class="absolute inset-0 bg-gradient-to-b from-secondary/95 to-secondary/50" />

      <div class="container relative mx-auto px-4 text-center">
        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <heart-icon class="h-8 w-8 text-accent" />
        </div>

        <h1 class="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Valentin & Marina</h1>

        <p class="mb-2 text-2xl font-medium">Request the pleasure of your company</p>

        <p class="mb-8 text-2xl font-light text-muted-foreground">as they celebrate their marriage</p>

        <div class="mb-10 flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div class="flex items-center space-x-2">
            <calendar-icon class="h-5 w-5 text-accent" />

            <span class="text-lg">June 11, 2025 • 4:00 PM</span>
          </div>

          <div class="hidden sm:block">•</div>

          <div class="flex items-center space-x-2">
            <map-pin-icon class="h-5 w-5 text-accent" />

            <span class="text-lg">The Grand Ballroom, New York</span>
          </div>
        </div>
        <el-button size="large" round type="primary">
          RSVP Now
        </el-button>
      </div>
    </section>

    <section class="bg-muted py-12">
      <div class="container mx-auto px-4 text-center">
        <h2 class="mb-10 text-3xl font-bold text-muted-foreground">Counting Down to Our Special Day</h2>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <el-card body-class="flex flex-col items-center justify-center p-6 bg-accent text-white">
            <span class="text-3xl font-bold">{{ daysLeft }}</span>
            <span class="text-sm">Days</span>
          </el-card>

          <el-card body-class="flex flex-col items-center justify-center p-6 bg-accent text-white">
            <span class="text-3xl font-bold">{{ hoursLeft }}</span>
            <span class="text-sm">Hours</span>
          </el-card>

          <el-card body-class="flex flex-col items-center justify-center p-6 bg-accent text-white">
            <span class="text-3xl font-bold">{{ minutesLeft }}</span>
            <span class="text-sm">Minutes</span>
          </el-card>

          <el-card body-class="flex flex-col items-center justify-center p-6 bg-accent text-white">
            <span class="text-3xl font-bold">{{ secondsLeft }}</span>
            <span class="text-sm">Seconds</span>
          </el-card>
        </div>
      </div>
    </section>

    <section class="py-16 relative">
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <flower class="left-[15%] md:top-10 top-2 md:w-40 w-20 fill-flower" :scroll="scroll" :speed="0.1" />

        <flower class="right-[10%] md:top-20 top-44 md:w-50 md:w-32 fill-flower-4" :scroll="scroll" :speed="0.15" />

        <flower class="left-[25%] md:top-20 top-1 md:w-72 w-36 fill-flower-2" :scroll="scroll" :speed="0.05" type="two" turn />

        <flower class="right-[15%] md:top-96 top-14 md:w-72 w-36 fill-flower-3" :scroll="scroll" :speed="0.05" type="two" />

        <flower class="left-[10%] md:top-96 top-32 md:w-72 w-36 fill-flower-4" :scroll="scroll" :speed="0.02" type="two" />

        <flower class="right-[5%] md:top-60 top-5 md:w-56 w-24 fill-flower-5" :scroll="scroll" :speed="0.2" turn />

        <flower class="left-[2%] md:top-56 top-16 md:w-56 w-24 fill-flower-5" :scroll="scroll" :speed="0.1" turn type="two"/>
      </div>

      <div class="mb-10 text-center">
        <h2 class="mb-4 text-3xl font-bold">Venue Locations</h2>
        <p class="mx-auto max-w-2xl text-foreground flex flex-col gap-2">
          <el-button size="large" @click="() => {coordinates = firstCoords}" round plain>
            <span class="font-bold">The Zags, 123 Wedding Avenue, New York</span>
          </el-button>

          <el-button size="large" @click="() => {coordinates = secondCoords}" round plain>
            <span class="font-bold">The Warm, 123 Wedding Avenue, New York</span>
          </el-button>
        </p>
      </div>

      <div class="mx-auto max-w-4xl overflow-hidden rounded-lg shadow-lg">
        <yandex-map
          :settings="{
            location: {
              center: coordinates,
              zoom: zoom,
              duration: 3000,
              easing: 'ease-in-out',
            },
            behaviors: [],
          }"
          width="100%"
          height="450px"
        >
          <yandex-map-default-scheme-layer />

          <yandex-map-default-features-layer />

          <!-- <yandex-map-listener :settings="{onClick: (object, event) => console.log(event.coordinates)}" /> -->

          <yandex-map-default-marker :settings="{ coordinates: coordinates }"/>
        </yandex-map>
      </div>
    </section>

    <section class="bg-muted py-16">
      <div class="container mx-auto px-4">
        <div class="mb-10 text-center">
          <h2 class="mb-4 text-3xl font-bold text-muted-foreground">RSVP</h2>
          <p class="mx-auto max-w-2xl text-muted-foreground">
            Please let us know if you'll be joining us on our special day by May 1, 2025
          </p>
        </div>

        <div class="mx-auto max-w-2xl rounded-lg bg-main-white p-6 shadow-lg">
          <el-form :model="form" label-position="top" size="large">
            <el-form-item label="Full Name" class="font-bold">
              <el-input v-model="form.name" class="font-normal" />
            </el-form-item>

            <el-form-item label="Will you be attending?" class="font-bold">
              <el-radio-group v-model="form.attending" class="font-normal">
                <el-radio :value="true">Sure</el-radio>
                <el-radio :value="false">Nope</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="Meal" class="font-bold">
              <el-select v-model="form.meal" class="font-normal">
                <el-option :value="'beef'" :label="'Говяжьи щёчки'" />
                <el-option :value="'fish'" :label="'Сёмга'" />
                <el-option :value="'chicken'" :label="'Курочка'" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button class="w-full" type="primary" @click="submitForm(form)">Done</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
  @import url('../assets/css/tailwind.css');

  .el-button+.el-button{
    margin-left: 0;
  }
</style>