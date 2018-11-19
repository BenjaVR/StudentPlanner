import firebaseConfig from "./firebaseConfig";

// tslint:disable-next-line:no-submodule-imports
import firebase from "firebase/app";
// tslint:disable-next-line:no-submodule-imports
import "firebase/firestore";
// tslint:disable-next-line:no-submodule-imports
import "firebase/functions";

export class FirebaseInitializer {
    public static initialize() {
        firebase.initializeApp(firebaseConfig);
        firebase.firestore().settings({timestampsInSnapshots: true});
    }
}

export const Firebase = firebase;
