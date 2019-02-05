import { IInternship } from "../../entities/IInternship";
import { nameof } from "../../helpers/nameof";
import { Department } from "../../models/Department";
import { Internship } from "../../models/Internship";
import { Student } from "../../models/Student";
import { Firebase } from "../FirebaseInitializer";
import { FirebaseModelMapper } from "../FirebaseModelMapper";
import { FirestoreRefs } from "../FirestoreRefs";

export class InternshipsRepository {

    public static async getInternshipsForStudent(student: Student): Promise<Internship[]> {
        const querySnapshot = await FirestoreRefs.getInternshipCollectionRef()
            .where(nameof<IInternship>("studentId"), "==", student.id)
            .get();

        const internshipEntities = FirebaseModelMapper.mapDocsToObjects<IInternship>(querySnapshot.docs);
        const internships = internshipEntities.map((entity) => Internship.fromEntity(entity));
        return internships;
    }

    public static async getInternshipsForDepartment(department: Department): Promise<Internship[]> {
        const querySnapshot = await FirestoreRefs.getInternshipCollectionRef()
            .where(nameof<IInternship>("departmentId"), "==", department.id)
            .get();

        const internshipEntities = FirebaseModelMapper.mapDocsToObjects<IInternship>(querySnapshot.docs);
        const internships = internshipEntities.map((entity) => Internship.fromEntity(entity));
        return internships;
    }

    public static async updateInternship(internship: Internship, doNotUpdateTimestamp: boolean = false): Promise<void> {
        if (internship.id === undefined) {
            return Promise.reject(Error("Internship should have an id"));
        }
        await FirestoreRefs.getInternshipDocRef(internship.id)
            .update(internship.getEntity(doNotUpdateTimestamp ? "updateWithoutTime" : "update"));
    }

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

    public static async deleteInternship(internship: Internship): Promise<void> {
        if (internship.id === undefined) {
            return Promise.reject(Error("Internship should have an id"));
        }
        await FirestoreRefs.getInternshipDocRef(internship.id)
            .delete();
    }
}
