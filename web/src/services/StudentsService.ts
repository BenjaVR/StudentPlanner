import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { Student } from "../models/Student";
import { FirebaseDtoMapper } from "./FirebaseDtoMapper";
import { Firebase } from "./FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class StudentsService extends FirestoreServiceBase<IStudent, Student> {
    protected readonly collectionRef = Firebase.firestore().collection("students");

    public getNotPlannedStudents(): Promise<Student[]> {
        return new Promise<Student[]>((resolve, reject) => {
            const isPlannedField: keyof IStudent = "isPlanned";
            const firstNameField: keyof IStudent = "firstName";
            const lastNameField: keyof IStudent = "lastName";
            this.collectionRef
                .where(isPlannedField, "==", false)
                .orderBy(firstNameField, "asc")
                .orderBy(lastNameField, "asc")
                .get()
                .then((querySnapshot) => {
                    const dtos = FirebaseDtoMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
                    const models = dtos.map((dto) => this.mapDtoToModel(dto));
                    resolve(models);
                })
                .catch((error) => {
                    this.catchErrorDev(error);
                    reject(error);
                });
        });
    }

    protected mapDtoToModel(dto: IStudent): Student {
        return new Student(dto);
    }
}
