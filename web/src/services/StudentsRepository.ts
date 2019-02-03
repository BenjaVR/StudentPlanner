import { IStudent } from "../entities/IStudent";
import { nameof } from "../helpers/nameof";
import { Student } from "../models/Student";
import { FirebaseModelMapper } from "./FirebaseModelMapper";
import { FirestoreRefs } from "./FirestoreRefs";

export class StudentsRepository {

    public static async getNotPlannedStudents(): Promise<Student[]> {
        const querySnapshot = await FirestoreRefs.getStudentCollectionRef()
            .where(nameof<Student>("isPlanned"), "==", false)
            .orderBy(nameof<Student>("firstName"), "asc")
            .orderBy(nameof<Student>("lastName"), "asc")
            .get();

        const studentEntities = FirebaseModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
        const students = studentEntities.map((entity) => Student.fromEntity(entity));
        return students;
    }
}
