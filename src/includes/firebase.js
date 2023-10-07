import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCKDzFxGEDXvs5UnUXtPkaXir0FvZEdsYs',
  authDomain: 'music-1da3c.firebaseapp.com',
  projectId: 'music-1da3c',
  storageBucket: 'music-1da3c.appspot.com',
  appId: '1:46994571202:web:e313fab0d270d4d381a05b'
}

firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

db.enablePersistence().catch((err) => {
  console.log(err)
})

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')

export { auth, db, usersCollection, songsCollection, commentsCollection, storage }
