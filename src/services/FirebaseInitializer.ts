import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseProdConfig = {
    apiKey: "AIzaSyAhHD7f5dudCPHiuidXqWQFzSyOmsmvWcU",
    authDomain: "stud-plan.firebaseapp.com",
    databaseURL: "https://stud-plan.firebaseio.com",
    messagingSenderId: "629622362066",
    projectId: "stud-plan",
    storageBucket: "stud-plan.appspot.com",
};

const firebaseDevConfig = {
    apiKey: "AIzaSyCFOU0G3d9mClLhf-PdYCF7sVYiObt-v94",
    authDomain: "stud-plan-dev.firebaseapp.com",
    databaseURL: "https://stud-plan-dev.firebaseio.com",
    messagingSenderId: "203179880570",
    projectId: "stud-plan-dev",
    storageBucket: "",
};

export class FirebaseInitializer {
    public static initialize(): void {
        if (process.env.NODE_ENV === "development" || process.env.REACT_APP_FIREBASE_DEPLOY === "dev") {
            firebase.initializeApp(firebaseDevConfig);
            firebase.firestore.setLogLevel("error");
        } else {
            firebase.initializeApp(firebaseProdConfig);
            firebase.firestore.setLogLevel("silent");
        }

        firebase.firestore().settings({ timestampsInSnapshots: true });
        firebase.firestore().enablePersistence();
    }
}

export const Firebase = firebase;
