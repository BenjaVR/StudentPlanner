import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyAhHD7f5dudCPHiuidXqWQFzSyOmsmvWcU",
    authDomain: "stud-plan.firebaseapp.com",
    databaseURL: "https://stud-plan.firebaseio.com",
    messagingSenderId: "629622362066",
    projectId: "stud-plan",
    storageBucket: "stud-plan.appspot.com",
};

export class FirebaseInitializer {
    public static initialize(): void {
        firebase.initializeApp(firebaseConfig);
        firebase.firestore().settings({ timestampsInSnapshots: true });
    }
}

export const Firebase = firebase;
