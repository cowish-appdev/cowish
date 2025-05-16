// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAkqyA57SQ9yxK1JrPn2TRvW-jo4KvwDWo",
    authDomain: "cowish-dc248.firebaseapp.com",
    projectId: "cowish-dc248",
    storageBucket: "cowish-dc248.firebasestorage.app",
    messagingSenderId: "928744915623",
    appId: "1:928744915623:web:0d4263e057ffbecbecd182"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth,provider}
