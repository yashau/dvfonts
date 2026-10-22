# @yashau/thaana-vue

Thaana (Dhivehi) for Vue 3: a `v-thaana` directive, ready inputs and Dhivehi web fonts. Includes everything from [`@yashau/thaana`](https://www.npmjs.com/package/@yashau/thaana).

```sh
npm i @yashau/thaana-vue
```

```vue
<script setup>
import { ref } from 'vue';
import { ThaanaInput, vThaana, useDhivehiFont, fontStack } from '@yashau/thaana-vue';
const name = ref('');
const dv = ref(true);
useDhivehiFont('Faruma');
</script>

<template>
	<ThaanaInput v-model="name" :dv="dv" :style="{ fontFamily: fontStack('Faruma') }" />
	<textarea v-thaana="{ enabled: dv }"></textarea>
</template>
```

Or register globally: `app.use(ThaanaPlugin)`.
