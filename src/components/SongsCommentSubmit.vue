<template>
  <div
    class="text-white text-center font-bold p-4 mb-4"
    v-if="comment_show_alert"
    :class="comment_alert_variant"
  >
    {{ comment_alert_message }}
  </div>
  <vee-form :validation-schema="schema_comment" @submit="comment">
    <vee-field
      type="textarea"
      name="comment"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
      placeholder="Your comment here..."
    />
    <ErrorMessage class="text-red-600" name="comment" />
    <button
      type="submit"
      class="py-1.5 px-3 rounded text-white bg-green-600 block"
      :disabled="comment_in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>
<script>
import { songsCollection, auth } from '../includes/firebase'
import firebase from 'firebase/app'

export default {
  name: 'SongsCommentSubmit',
  props: {
    getSong: {
      type: Function,
      required: true
    },
    getComments: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      schema_comment: {
        comment: 'required|min:3|max:500'
      },
      comment_show_alert: false,
      comment_in_submission: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Great! Your comment has been submitted.',
      songs_count: 0
    }
  },
  methods: {
    async comment(values) {
      this.comment_in_submission = true
      this.comment_show_alert = true
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_message = 'Please wait while we submit your comment.'

      if (!auth.currentUser) {
        this.comment_in_submission = false
        this.comment_show_alert = true
        this.comment_alert_variant = 'bg-red-500'
        this.comment_alert_message = 'Please login to submit a comment.'
        setTimeout(() => {
          this.comment_show_alert = false
        }, 2000)
        return
      }

      const comment = {
        uid: auth.currentUser.uid,
        user: auth.currentUser.displayName,
        comment: values.comment,
        created_at: new Date()
      }

      try {
        await songsCollection.doc(this.$route.params.id).collection('comments').add(comment)
        await songsCollection.doc(this.$route.params.id).update({
          comment_count: firebase.firestore.FieldValue.increment(1)
        })
        this.comment_in_submission = false
        this.comment_show_alert = true
        this.comment_alert_variant = 'bg-green-500'
        this.comment_alert_message = 'Great! Your comment has been submitted.'
        setTimeout(() => {
          this.comment_show_alert = false
        }, 2000)
      } catch (error) {
        this.comment_in_submission = false
        this.comment_show_alert = true
        this.comment_alert_variant = 'bg-red-500'
        this.comment_alert_message = 'Sorry! Your comment could not be submitted.'
        setTimeout(() => {
          this.comment_show_alert = false
        }, 2000)
      }
      this.getSong()
      this.getComments()
    }
  }
}
</script>
