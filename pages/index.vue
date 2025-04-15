<script setup lang="ts">
  import {
    HeartIcon,
    CalendarIcon,
    MapPinIcon,
    PenLineIcon,
    PartyPopperIcon
  } from 'lucide-vue-next';
  import {
    YandexMap,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSchemeLayer,
    YandexMapMarker,
  } from 'vue-yandex-maps';
  import ConfettiExplosion from 'vue-confetti-explosion';
  import type { LngLat } from '@yandex/ymaps3-types';
  import type { IForm } from "~/types/IForm";
  import type {IGuest} from "~/types/IGuest";
  import type {FormInstance, FormRules} from 'element-plus';

  definePageMeta({
    middleware: ['auth'],
  });

  const params = useRoute().query;

  const authId = params['authId'];

  const firstCoords: LngLat = [65.56256758019137, 57.13613331616409];
  const secondCoords: LngLat = [65.399308, 57.274270];

  const coordinates = ref(firstCoords);
  const zoom = ref(16);

  const rscv = useTemplateRef('rscv');

  const form = reactive<IForm>({
    name: '',
    attending: true,
    meal: null,
    drink: null,
    comment: null,
  });

  watch(() => form.attending, () => {
    form.meal = null;
    form.drink = null;
  });

  const formRef = ref<FormInstance>();

  const formRules = computed<FormRules<IForm>>(() => ({
    name: [
      { required: true, message: 'Заполните имя', trigger: 'blur' },
      { min: 1, max: 100, message: 'От 1 до 100 символов', trigger: 'blur'},
    ],
    attending: [
      { required: true, message: 'Выберите', trigger: 'blur' },
    ],
    meal: [
      { required: form.attending, message: 'Выберите еду', trigger: 'blur' },
    ],
    drink: [
      { type: 'array', required: form.attending, message: 'Выберите хотя бы один напиток', trigger: 'blur' }
    ],
    comment: [
      { max: 1000, message: 'Максимум 1000 символов', trigger: 'blur' },
    ],
  }));

  const mealOptions = [
    {value: 'chicken', label: 'Курица'},
    {value: 'beef', label: 'Говяжьи щёчки'},
    {value: 'fish', label: 'Форель'},
  ];

  const drinkOptions = [
    {value: 'vodka', label: 'Водку'},
    {value: 'white-vine', label: 'Белое Вино'},
    {value: 'red-vine', label: 'Красное Вино'},
    {value: 'whisky', label: 'Виски'},
    {value: 'cognac', label: 'Коньяк'},
  ];

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

  const explode = ref(false);

  const submitForm = async (form: IForm) => {
    try {
      if (!formRef.value) {
        return;
      }

      await formRef.value.validate(async (isValid) => {
        if (!isValid) {
          ElNotification.error({ title: 'Проверьте правильно ли заполнена форма' });

          return;
        }

        const {meal, name, attending, drink, comment} = form;

        explode.value = false;

        await $fetch('/api/submit', {
          method: 'post',
          body: {
            meal,
            name,
            drink,
            attending,
            authId,
            comment,
          }
        });

        explode.value = true;

        ElNotification.success({
          title: attending ? 'Отлично!' : 'Очень жаль',
          message: attending ? 'Будем вас ждать' : 'Возможно вы передумаете'
        });
      });
    } catch (error) {
      ElNotification.error({ title: 'Непредвиденная ошибка', message: `${error}` });
    }
  };

  const onRSCVClick = () => {
    rscv.value?.scrollIntoView({ behavior: 'smooth' });
  };

  const {data} = await useFetch<IGuest>('/api/guest', { method: 'post', body: { authId: authId } });

  if (data.value) {
    form.meal = data.value.meal ?? null;
    form.drink = data.value.drink ?? null;
    form.attending = data.value.attending;
    form.name = data.value.name ?? '';
    form.comment = data.value.comment ?? null;
  }

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
  <main class="flex min-h-screen flex-col font-wenkai">
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

        <h1 class="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Валентин & Марина</h1>

        <p class="mb-2 text-2xl font-medium">Мы хотим, чтобы вы составили нам компанию</p>

        <p class="mb-8 text-2xl font-light text-muted-foreground">на нашей свадьбе</p>

        <div class="mb-10 flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div class="flex items-center space-x-2">
            <calendar-icon class="h-5 w-5 text-accent" />

            <span class="text-lg">11 июня 2025 • 15:45</span>
          </div>

          <div class="hidden sm:block">•</div>

          <div class="flex items-center space-x-2">
            <map-pin-icon class="h-5 w-5 text-accent" />

            <span class="text-lg">ЗАГС, Малыгина 85, Тюмень</span>
          </div>
        </div>
        <el-button size="large" round type="primary" @click="onRSCVClick">
          Ваш ответ
        </el-button>
      </div>
    </section>

    <section class="bg-muted py-12">
      <div class="container mx-auto px-4 text-center">
        <h2 class="mb-10 text-3xl font-bold text-muted-foreground">До особого момента осталось</h2>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <el-card body-class="flex flex-col items-center justify-center p-6 bg-accent text-white">
            <span class="text-3xl font-bold">{{ daysLeft }}</span>
            <span class="text-sm">Дней</span>
          </el-card>

          <el-card body-class="flex flex-col items-center justify-center p-6 bg-accent text-white">
            <span class="text-3xl font-bold">{{ hoursLeft }}</span>
            <span class="text-sm">Часов</span>
          </el-card>

          <el-card body-class="flex flex-col items-center justify-center p-6 bg-accent text-white">
            <span class="text-3xl font-bold">{{ minutesLeft }}</span>
            <span class="text-sm">Минут</span>
          </el-card>

          <el-card body-class="flex flex-col items-center justify-center p-6 bg-accent text-white">
            <span class="text-3xl font-bold">{{ secondsLeft }}</span>
            <span class="text-sm">Секунд</span>
          </el-card>
        </div>
      </div>
    </section>

    <section class="py-16 relative">
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <flower class="md:left-[15%] left-[10%] md:top-10 top-2 md:w-40 w-20 fill-flower" :scroll="scroll" :speed="0.1" />

        <flower class="right-[10%] md:top-20 top-52 md:w-50 md:w-32 fill-flower-4" :scroll="scroll" :speed="0.15" />

        <flower class="right-[1%] md:top-20 top-32 md:w-50 md:w-32 fill-flower" :scroll="scroll" :speed="0.25" type="two" turn />

        <flower class="left-[25%] md:top-20 top-1 md:w-72 w-36 fill-flower-2" :scroll="scroll" :speed="0.08" type="two" turn />

        <flower class="md:right-[15%] right-[20%] md:top-96 top-20 md:w-72 w-36 fill-flower-3" :scroll="scroll" :speed="0.08" type="two" />

        <flower class="left-[2%] md:top-96 top-32 md:w-72 w-36 fill-flower-4" :scroll="scroll" :speed="0.08" type="two" />

        <flower class="right-[5%] md:top-60 top-5 md:w-56 w-24 fill-flower-5" :scroll="scroll" :speed="0.2" turn />

        <flower class="left-[2%] md:top-56 top-16 md:w-56 w-24 fill-flower-5" :scroll="scroll" :speed="0.1" turn type="two"/>
      </div>

      <div class="mb-10 text-center">
        <h2 class="mb-4 text-3xl font-bold">Наше торжество на карте</h2>
        <div class="mx-auto max-w-2xl text-foreground flex flex-col items-center gap-2">
          <el-button size="large" @click="() => {coordinates = firstCoords}" round plain>
            <template #icon>
              <pen-line-icon class="stroke-accent" />
            </template>

            <span class="font-bold">Церемония - Загс</span>
          </el-button>

          <el-button size="large" @click="() => {coordinates = secondCoords}" round plain>
            <template #icon>
              <party-popper-icon class="stroke-accent" />
            </template>

            <span class="font-bold">Банкет - Территория отдыха 'Тепло'</span>
          </el-button>
        </div>
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
            behaviors: ['drag', 'pinchZoom'],
          }"
          width="100%"
          height="450px"
        >
          <yandex-map-default-scheme-layer />

          <yandex-map-default-features-layer />

          <yandex-map-marker :settings="{ coordinates: coordinates }">
            <heart-icon class="fill-accent stroke-accent w-20 h-auto -translate-x-10 -translate-y-20" />
          </yandex-map-marker>
        </yandex-map>
      </div>
    </section>

    <section class="relative min-h-screen">
      <div class="bg-muted absolute inset-0 -z-20 overflow-hidden" />

      <div class="absolute inset-0 -z-10 overflow-hidden">
        <flower class="left-[5%] md:top-10 top-2 md:w-40 w-20 fill-white" :scroll="scroll" :speed="0.1" type="two" turn />

        <flower class="right-[10%] md:top-20 top-[80%] md:w-50 md:w-32 fill-white" :scroll="scroll" :speed="0.15" type="two" turn />

        <flower class="left-[25%] md:top-20 top-0 md:w-72 w-36 fill-white" :scroll="scroll" :speed="0.05" type="two" />

        <flower class="right-[10%] md:top-[60%] top-14 md:w-72 w-36 fill-white" :scroll="scroll" :speed="0.07" type="one" turn />

        <flower class="left-[10%] md:top-[50%] top-[90%] md:w-72 w-36 fill-white" :scroll="scroll" :speed="0.06" type="one" turn />

        <flower class="right-[5%] md:top-60 -top-1 md:w-56 w-24 fill-white" :scroll="scroll" :speed="0.2" type="two" />

        <flower class="left-[2%] md:top-56 top-24 md:w-56 w-24 fill-white" :scroll="scroll" :speed="0.1" />
      </div>

      <div class="py-16" ref="rscv">
        <div class="container mx-auto px-4">
          <div class="mb-10 text-center">
            <h2 class="mb-4 text-3xl font-bold text-muted-foreground">Ваш ответ</h2>
            <p class="mx-auto max-w-2xl text-muted-foreground">
              Пожалуйста, дайте нам знать <br> до 11 мая 2025 г.
            </p>
          </div>

          <div class="mx-auto max-w-2xl rounded-lg bg-main-white p-6 shadow-lg">
            <el-form
              :model="form"
              label-position="top"
              size="large"
              ref="formRef"
              :rules="formRules"
              status-icon
            >
              <el-form-item label="Ваше имя" class="font-bold" prop="name">
                <el-input v-model="form.name" class="font-normal" placeholder="Панов Валентин Иванович" />
              </el-form-item>

              <el-form-item label="Вы с нами?" class="font-bold" prop="attending">
                <el-radio-group v-model="form.attending" class="font-normal">
                  <el-radio :value="true">Конечно, да</el-radio>
                  <el-radio :value="false">К сожалению, нет</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="Что предпочтёте есть?" class="font-bold" prop="meal">
                <el-select-v2
                  v-model="form.meal"
                  class="font-normal"
                  :options="mealOptions"
                  :disabled="!form.attending"
                  placeholder="Выберите горячее блюдо"
                />
              </el-form-item>

              <el-form-item label="Что предпочтёте пить?" class="font-bold" prop="drink">
                <el-select-v2
                  v-model="form.drink"
                  class="font-normal"
                  :options="drinkOptions"
                  multiple
                  :disabled="!form.attending"
                  placeholder="Выберите один или несколько напитков"
                />
              </el-form-item>

              <el-form-item label="Комментарий" class="font-bold" prop="comment">
                <el-input
                  v-model="form.comment"
                  class="font-normal"
                  placeholder="Напишите, если будет +1 или дети. А также всё, что сочтёте важным упомянуть, или любой вопрос"
                  type="textarea"
                  maxlength="1000"
                  show-word-limit
                  resize="none"
                  :rows="4"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <div class="flex flex-col w-full items-center">
                  <el-button class="w-full" type="primary" @click="submitForm(form)">Ответить</el-button>

                  <confetti-explosion
                      v-if="explode"
                      :particleCount="50"
                      :colors="['var(--flower)', 'var(--flower-2)', 'var(--flower-3)', 'var(--flower-4)', 'var(--flower-5)']"
                  />
                </div>
              </el-form-item>
            </el-form>
          </div>
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
