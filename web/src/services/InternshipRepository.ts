import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { Internship } from "../models/Internship";
import { Firebase } from "./FirebaseInitializer";
import { FirestoreRefs } from "./FirestoreRefs";

export class InternshipRepository {

    public static async addOrUpdateInternshipForStudent(internship: Internship, student: IStudent): Promise<void> {
        if (student.isPlanned === true) {
            throw new Error("Student is already planned");
        }
        if (student.id === undefined) {
            throw new Error("Student should have an id");
        }

        const studentDocRef = FirestoreRefs.getStudentDocRef(student.id);
        const internshipDocRef = FirestoreRefs.getInternshipDocRef();

        internship.studentId = student.id;
        student.isPlanned = true;

        // TODO: TMP
        const entityObj = student as { [key: string]: any };
        Object.keys(entityObj).forEach((key) => {
            if (entityObj[key] === undefined || entityObj[key] === "") {
                entityObj[key] = null;
            }
        });

        await Firebase.firestore().batch()
            .set(internshipDocRef, internship.getEntity("new"))
            .update(studentDocRef, entityObj) // TODO: getEntity
            .commit();
    }
}
