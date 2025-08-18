// viewCounter.js（模組格式）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// Firebase 設定
const firebaseConfig = {
    apiKey: "AIzaSyBxm4p3wiRtGFFAoB9vgHyDFhKKpwPonSE",
    authDomain: "trupeak-website.firebaseapp.com",
    databaseURL: "https://trupeak-website-default-rtdb.firebaseio.com",
    projectId: "trupeak-website",
    storageBucket: "trupeak-website.firebasestorage.app",
    messagingSenderId: "485386182710",
    appId: "1:485386182710:web:7bc149939dba159a1fb897",
    measurementId: "G-GJBS99DX1E"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 頁面 ID
const pageId = "home";
const viewRef = ref(db, "views/" + pageId);

// 更新瀏覽次數
runTransaction(viewRef, current => {
  return (current || 0) + 1;
});

// 顯示瀏覽次數
onValue(viewRef, snapshot => {
  document.getElementById("viewCount").textContent = "本頁瀏覽次數：" + snapshot.val();
});