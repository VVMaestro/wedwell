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

  const firstCoords: LngLat = [65.56256758019137, 57.13613331616409];
  const secondCoords: LngLat = [65.38411343817563, 57.27367554542644];

  const coordinates = ref(firstCoords);

  const form = reactive({
    name: '',
    email: '',
    attending: true,
    dietaryRestrictions: '',
  });

  const scroll = ref(0);

  const handleScroll = () => {
    scroll.value = window.scrollY;
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
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
          fit="cover"
          alt="Wedding background"
          class="opacity-80"
          densities="x1 x2"
        />
      </div>

      <div class="absolute inset-0 bg-gradient-to-b from-secondary/80 to-secondary/60" />

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
          <el-card body-class="flex flex-col items-center justify-center p-6 bg-main-white">
            <span class="text-3xl font-bold">85</span>
            <span class="text-sm">Days</span>
          </el-card>

          <el-card body-class="flex flex-col items-center justify-center p-6 bg-main-white">
            <span class="text-3xl font-bold">12</span>
            <span class="text-sm">Hours</span>
          </el-card>

          <el-card body-class="flex flex-col items-center justify-center p-6 bg-main-white">
            <span class="text-3xl font-bold">45</span>
            <span class="text-sm">Minutes</span>
          </el-card>

          <el-card body-class="flex flex-col items-center justify-center p-6 bg-main-white">
            <span class="text-3xl font-bold">30</span>
            <span class="text-sm">Seconds</span>
          </el-card>
        </div>
      </div>
    </section>

    <section class="py-16 relative">
      <flower class="left-[15%] top-10 w-40 fill-flower" :scroll="scroll" :speed="0.1" />

      <flower class="right-[15%] top-15 w-50 fill-flower-4" :scroll="scroll" :speed="0.15" />

      <flower class="left-[25%] top-20 w-60 fill-flower-2" :scroll="scroll" :speed="0.05" />

      <flower class="right-[10%] bottom-10 w-72 fill-flower-3" :scroll="scroll" :speed="0.05" />

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
              zoom: 16,
              duration: 1000,
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

            <el-form-item label="Email" class="font-bold">
              <el-input v-model="form.email" class="font-normal" />
            </el-form-item>

            <el-form-item label="Will you be attending?" class="font-bold">
              <el-radio-group v-model="form.attending" class="font-normal">
                <el-radio :value="true">Sure</el-radio>
                <el-radio :value="false" fill="#67c23a">Nope</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="Dietary Restrictions" class="font-bold">
              <el-input v-model="form.dietaryRestrictions" type="textarea" class="font-normal" />
            </el-form-item>

            <el-form-item>
              <el-button class="w-full" type="primary" @click="console.log(form)">Done</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="css">
  @import url('~/assets/css/tailwind.css');

  .el-button+.el-button{
    margin-left: 0;
  }
</style>
