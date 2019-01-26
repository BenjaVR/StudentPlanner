import { IDepartment } from "studentplanner-functions/shared/contract/IDepartment";
import { Department } from "../models/Department";
import { Firebase } from "./FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class DepartmentsService extends FirestoreServiceBase<IDepartment, Department> {
    protected readonly collectionRef = Firebase.firestore().collection("departments");

    protected mapDtoToModel(dto: IDepartment): Department {
        return new Department(dto);
    }
}
