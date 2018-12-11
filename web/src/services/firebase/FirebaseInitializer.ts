import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import firebaseConfig from "./firebaseConfig";

export class FirebaseInitializer {
    public static initialize(): void {
        firebase.initializeApp(firebaseConfig);
        firebase.firestore().settings({timestampsInSnapshots: true});
    }
}

export const Firebase = firebase;
