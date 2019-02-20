import { IStudent } from "../../entities/IStudent";
import { nameof } from "../../helpers/nameof";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import { School } from "../../models/School";
import { IStudentInternship, Student } from "../../models/Student";
import { FirebaseModelMapper } from "../FirebaseModelMapper";
import { FirestoreRefs } from "../FirestoreRefs";

export class StudentsRepository {

    public static subscribeToStudents(onListen: (students: Student[]) => void): () => void {
        return FirestoreRefs.getStudentCollectionRef()
            .orderBy(nameof<IStudent>("createdTimestamp"), "desc")
            .onSnapshot((querySnapshot) => {
                const studentEntities = FirebaseModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
                const students = studentEntities.map((entity) => Student.fromEntity(entity));
                onListen(students);
            });
    }

    public static subscribeToPlannedStudents(onListen: (students: Student[]) => void): () => void {
        return FirestoreRefs.getStudentCollectionRef()
            .where(nameof<IStudent>("isPlanned"), "==", true)
            .orderBy(nameof<IStudent, IStudentInternship>("internship", "startDate"), "asc")
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

    public static async getStudentsWithEducation(education: Education): Promise<Student[]> {
        const querySnapshot = await FirestoreRefs.getStudentCollectionRef()
            .where(nameof<IStudent>("educationId"), "==", education.id)
            .get();

        const studentEntities = FirebaseModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
        const students = studentEntities.map((entity) => Student.fromEntity(entity));
        return students;
    }

    public static async getStudentsWithSchool(school: School): Promise<Student[]> {
        const querySnapshot = await FirestoreRefs.getStudentCollectionRef()
            .where(nameof<IStudent>("schoolId"), "==", school.id)
            .get();

        const studentEntities = FirebaseModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
        const students = studentEntities.map((entity) => Student.fromEntity(entity));
        return students;
    }

    public static async getPlannedStudentsWithDepartment(department: Department): Promise<Student[]> {
        const querySnapshot = await FirestoreRefs.getStudentCollectionRef()
            .where(nameof<IStudent, IStudentInternship>("internship", "departmentId"), "==", department.id)
            .get();

        const studentEntities = FirebaseModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
        const students = studentEntities.map((entity) => Student.fromEntity(entity));
        return students;
    }

    public static async getPlannedStudentsForSchool(school: School): Promise<Student[]> {
        const querySnapshot = await FirestoreRefs.getStudentCollectionRef()
            .where(nameof<IStudent>("schoolId"), "==", school.id)
            .where(nameof<IStudent>("isPlanned"), "==", true)
            .orderBy(nameof<IStudent, IStudentInternship>("internship", "startDate"), "asc")
            .get();

        const studentEntities = FirebaseModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
        const students = studentEntities.map((entity) => Student.fromEntity(entity));
        return students;
    }

    public static async addStudent(student: Student): Promise<void> {
        await FirestoreRefs.getStudentCollectionRef()
            .add(student.getEntity("new"));
    }

    public static async addInternshipForStudent(internship: IStudentInternship, student: Student): Promise<void> {
        if (student.isPlanned === true) {
            return Promise.reject(Error("Student is already planned"));
        }
        if (student.id === undefined) {
            return Promise.reject(Error("Student should have an id"));
        }

        const studentDocRef = FirestoreRefs.getStudentDocRef(student.id);

        student.isPlanned = true;
        student.internship = internship;

        await studentDocRef.update(student.getEntity("update"));
    }

    public static async removeInternshipForStudent(student: Student): Promise<void> {
        if (student.id === undefined) {
            return Promise.reject(Error("Student should have an id"));
        }

        const studentDocRef = FirestoreRefs.getStudentDocRef(student.id);

        student.isPlanned = false;
        student.internship = undefined;

        await studentDocRef.update(student.getEntity("update"));
    }

    public static async updateStudent(student: Student, doNotUpdateTimestamp: boolean = false): Promise<void> {
        if (student.id === undefined) {
            return Promise.reject(Error("Student should have an id"));
        }
        await FirestoreRefs.getStudentDocRef(student.id)
            .update(student.getEntity(doNotUpdateTimestamp ? "updateWithoutTime" : "update"));
    }

    public static async deleteStudent(student: Student): Promise<void> {
        if (student.id === undefined) {
            return Promise.reject(Error("Student should have an id"));
        }
        await FirestoreRefs.getStudentDocRef(student.id)
            .delete();
    }
}
