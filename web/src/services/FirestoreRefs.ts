import { Firebase } from "./FirebaseInitializer";

export class FirestoreRefs {

    public static getInternshipCollectionRef(): firebase.firestore.CollectionReference {
        return Firebase.firestore().collection("internships");
    }

    public static getInternshipDocRef(docId?: string): firebase.firestore.DocumentReference {
        return docId === undefined
            ? this.getInternshipCollectionRef().doc()
            : this.getInternshipCollectionRef().doc(docId);
    }

    public static getStudentCollectionRef(): firebase.firestore.CollectionReference {
        return Firebase.firestore().collection("students");
    }

    public static getStudentDocRef(docId?: string): firebase.firestore.DocumentReference {
        return docId === undefined
            ? this.getStudentCollectionRef().doc()
            : this.getStudentCollectionRef().doc(docId);
    }
}
