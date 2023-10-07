<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/Music/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="playSong(songs)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ songs.modified_name }}</div>
          <div>{{ songs.genre }}</div>
          <div class="song-price">{{ $n(1, 'currency') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $tc('song.comment_count', songs.comment_count, {
              count: songs.comment_count
            })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <SongsCommentSubmit :getSong="getSong" :getComments="getComments" />
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <ul class="container mx-auto">
      <SongsComments v-for="comment in sortedComments" :key="comment" :comment="comment" />
    </ul>
  </main>
</template>
<script>
import { songsCollection, commentsCollection } from '../includes/firebase'
import SongsComments from '@/components/SongsComments.vue'
import SongsCommentSubmit from '../components/SongsCommentSubmit.vue'
import { mapActions, mapState } from 'pinia'
import usePlayerStore from '@/stores/player'

export default {
  name: 'Song',
  components: {
    SongsComments,
    SongsCommentSubmit
  },
  data() {
    return {
      songs: {},
      comments: [],
      sort: '1'
    }
  },
  async beforeRouteEnter(to, from, next) {
    const song = await songsCollection.doc(to.params.id).get()
    next((vm) => {
      if (!song.exists) {
        vm.$router.push({ name: 'home' })
        return
      }

      const { sort } = vm.$route.query

      vm.sort = sort === '1' || sort === '2' ? sort : '1'

      vm.songs = song.data()
      vm.getComments()
    })
  },
  methods: {
    ...mapActions(usePlayerStore, ['playSong']),
    async getComments() {
      this.comments = []
      const comments = await commentsCollection
        .where('song_id', '==', this.$route.params.id)
        .orderBy('created_at', 'desc')
        .get()

      comments.forEach((comment) => {
        this.comments.push({
          docID: comment.id,
          ...comment.data()
        })
      })
    }
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) return
      this.$router.push({ query: { sort: newVal } })
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['playing']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.created_at) - new Date(a.created_at)
        }
        return new Date(a.created_at) - new Date(b.created_at)
      })
    }
  }
}
</script>
