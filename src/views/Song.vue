<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ songs.modified_name }}</div>
        <div>{{ songs.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments {{ songs.comment_count }}</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <SongsCommentSubmit :getSong="getSong" :getComments="getComments" />
        <!-- Sort Comments -->
        <select
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <ul class="container mx-auto">
    <SongsComments v-for="comment in comments" :key="comment" :comment="comment" />
  </ul>
</template>
<script>
import { songsCollection } from '../includes/firebase'
import SongsComments from '@/components/SongsComments.vue'
import SongsCommentSubmit from '../components/SongsCommentSubmit.vue'

export default {
  name: 'Song',
  components: {
    SongsComments,
    SongsCommentSubmit
  },
  data() {
    return {
      songs: {},
      comments: []
    }
  },
  created() {
    this.getSong()
    this.getComments()
  },
  methods: {
    async getSong() {
      const song = await songsCollection.doc(this.$route.params.id).get()

      if (!song.exists) {
        this.$router.push({ name: 'home' })
        return
      }

      this.songs = song.data()
    },

    async getComments() {
      this.comments = []
      const comments = await songsCollection
        .doc(this.$route.params.id)
        .collection('comments')
        .orderBy('created_at', 'desc')
        .get()

      comments.forEach((comment) => {
        this.comments.push(comment.data())
      })

      // format date
      this.comments.forEach((comment) => {
        const date = new Date(comment.created_at.seconds * 1000)
        comment.created_at = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      })
    }
  }
}
</script>
