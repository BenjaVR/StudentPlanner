import { IStudent } from "../../entities/IStudent";
import { nameof } from "../../helpers/nameof";
import { Student } from "../../models/Student";
import { FirebaseModelMapper } from "../FirebaseModelMapper";
import { FirestoreRefs } from "../FirestoreRefs";

export class StudentsRepository {

    public static subscribeToStudents(onListen: (students: Student[]) => void): () => void {
        return FirestoreRefs.getStudentCollectionRef()
            .orderBy(nameof<IStudent>("updatedTimestamp"), "desc")
            .onSnapshot((querySnapshot) => {
            const studentEntities = FirebaseModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
            const students = studentEntities.map((entity) => Student.fromEntity(entity));
            onListen(students);
        });
    }

    public static async getNotPlannedStudents(): Promise<Student[]> {
        const querySnapshot = await FirestoreRefs.getStudentCollectionRef()
            .where(nameof<IStudent>("isPlanned"), "==", false)
            .orderBy(nameof<IStudent>("firstName"), "asc")
            .orderBy(nameof<IStudent>("lastName"), "asc")
            .get();

        const studentEntities = FirebaseModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
        const students = studentEntities.map((entity) => Student.fromEntity(entity));
        return students;
    }

    public static async addStudent(student: Student): Promise<void> {
        await FirestoreRefs.getStudentCollectionRef()
            .add(student.getEntity("new"));
    }

    public static async updateStudent(student: Student): Promise<void> {
        if (student.id === undefined) {
            return Promise.reject(Error("Student should have an id"));
        }
        await FirestoreRefs.getStudentDocRef(student.id)
            .update(student.getEntity("update"));
    }

    public static async deleteStudent(student: Student): Promise<void> {
        if (student.id === undefined) {
            return Promise.reject(Error("Student should have an id"));
        }
        await FirestoreRefs.getStudentDocRef(student.id)
            .delete();
    }
}
