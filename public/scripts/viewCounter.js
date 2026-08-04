import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, onValue, ref, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxm4p3wiRtGFFAoB9vgHyDFhKKpwPonSE",
  authDomain: "trupeak-website.firebaseapp.com",
  databaseURL: "https://trupeak-website-default-rtdb.firebaseio.com",
  projectId: "trupeak-website",
  storageBucket: "trupeak-website.firebasestorage.app",
  messagingSenderId: "485386182710",
  appId: "1:485386182710:web:7bc149939dba159a1fb897",
  measurementId: "G-GJBS99DX1E",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const homeViewRef = ref(database, "views/home");

window.startFirebaseViewCounter = (handleValue, handleError) => {
  runTransaction(homeViewRef, (currentValue) => (currentValue || 0) + 1).catch(handleError);

  return onValue(
    homeViewRef,
    (snapshot) => handleValue(Number(snapshot.val() || 0)),
    handleError,
  );
};
