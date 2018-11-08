import firebase from "firebase/app";

const app = firebase.initializeApp({
  apiKey: 'AIzaSyBE7Dx4ojDK1KRyC8ru6YGeJGicLXvTMtA',
  authDomain: 'englishlearning-inatec.firebaseapp.com',
  databaseURL: 'https://englishlearning-inatec.firebaseio.com',
  projectId: 'englishlearning-inatec',
  storageBucket: 'englishlearning-inatec.appspot.com',
  messagingSenderId: '897690750682'
});

export default app;