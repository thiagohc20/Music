<template>
  <app-header />

  <router-view v-slot="{ Component }">
    <Transition name="slide-fade">
      <component :is="Component"></component>
    </Transition>
  </router-view>
  <!-- Player -->
  <app-player />
  <auth />
</template>

<script>
import AppHeader from '@/components/Header.vue'
import AppPlayer from '@/components/Player.vue'
import Auth from '@/components/Auth.vue'
import { mapWritableState } from 'pinia'
import useUserStore from '@/stores/user'
import { auth } from './includes/firebase'

export default {
  name: 'App',
  components: {
    AppPlayer,
    AppHeader,
    Auth
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  }
}
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.3, 0.3, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
