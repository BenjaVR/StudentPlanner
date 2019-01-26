import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { Firebase } from "./FirebaseInitializer";
import { FirebaseModelMapper } from "./FirebaseModelMapper";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class StudentsService extends FirestoreServiceBase<IStudent> {
    protected readonly collectionRef = Firebase.firestore().collection("students");

    public getNotPlannedStudents(): Promise<IStudent[]> {
        return new Promise<IStudent[]>((resolve, reject) => {
            const isPlannedField: keyof IStudent = "isPlanned";
            const firstNameField: keyof IStudent = "firstName";
            const lastNameField: keyof IStudent = "lastName";
            this.collectionRef
                .where(isPlannedField, "==", false)
                .orderBy(firstNameField, "asc")
                .orderBy(lastNameField, "asc")
                .get()
                .then((querySnapshot) => {
                    const students = FirebaseModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
                    resolve(students);
                })
                .catch((error) => {
                    this.catchErrorDev(error);
                    reject(error);
                });
        });
    }

    public add(student: IStudent): Promise<void> {
        student.isPlanned = student.isPlanned || false; // Make sure this field is not empty.
        return super.add(student);
    }
}
