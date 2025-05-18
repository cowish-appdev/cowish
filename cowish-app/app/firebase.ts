// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { EXPO_apiKey, EXPO_authDomain,
    EXPO_projectId,EXPO_storageBucket,
    EXPO_messagingSenderId, EXPO_appId} from '@env';

// Your web app's Firebase configuration
console.log(EXPO_apiKey)
const firebaseConfig = {
    apiKey: EXPO_apiKey,
    authDomain: EXPO_authDomain,
    projectId: EXPO_projectId,
    storageBucket: EXPO_storageBucket,
    messagingSenderId: EXPO_messagingSenderId,
    appId: EXPO_appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth,provider}
