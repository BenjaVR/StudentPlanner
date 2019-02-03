import { Internship } from "../models/Internship";
import { Student } from "../models/Student";
import { Firebase } from "./FirebaseInitializer";
import { FirestoreRefs } from "./FirestoreRefs";

export class InternshipsRepository {

    public static async addInternshipForStudent(internship: Internship, student: Student): Promise<void> {
        if (student.isPlanned === true) {
            return Promise.reject(Error("Student is already planned"));
        }
        if (student.id === undefined) {
            return Promise.reject(Error("Student should have an id"));
        }

        const studentDocRef = FirestoreRefs.getStudentDocRef(student.id);
        const internshipDocRef = FirestoreRefs.getInternshipDocRef();

        internship.studentId = student.id;
        student.isPlanned = true;

        await Firebase.firestore().batch()
            .set(internshipDocRef, internship.getEntity("new"))
            .update(studentDocRef, student.getEntity("update"))
            .commit();
    }
}
