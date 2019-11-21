import firebase from "firebase";
import { Firebase } from "./FirebaseInitializer";

export class FirestoreRefs {
    public static getStudentCollectionRef(): firebase.firestore.CollectionReference {
        return Firebase.firestore().collection("students");
    }

    public static getStudentDocRef(docId?: string): firebase.firestore.DocumentReference {
        return docId === undefined ? this.getStudentCollectionRef().doc() : this.getStudentCollectionRef().doc(docId);
    }

    public static getDepartmentCollectionRef(): firebase.firestore.CollectionReference {
        return Firebase.firestore().collection("departments");
    }

    public static getDepartmentDocRef(docId?: string): firebase.firestore.DocumentReference {
        return docId === undefined
            ? this.getDepartmentCollectionRef().doc()
            : this.getDepartmentCollectionRef().doc(docId);
    }

    public static getSchoolCollectionRef(): firebase.firestore.CollectionReference {
        return Firebase.firestore().collection("schools");
    }

    public static getSchoolDocRef(docId?: string): firebase.firestore.DocumentReference {
        return docId === undefined ? this.getSchoolCollectionRef().doc() : this.getSchoolCollectionRef().doc(docId);
    }

    public static getEducationCollectionRef(): firebase.firestore.CollectionReference {
        return Firebase.firestore().collection("educations");
    }

    public static getEducationDocRef(docId?: string): firebase.firestore.DocumentReference {
        return docId === undefined
            ? this.getEducationCollectionRef().doc()
            : this.getEducationCollectionRef().doc(docId);
    }
}
