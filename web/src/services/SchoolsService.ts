import { ISchool } from "studentplanner-functions/shared/contract/ISchool";
import { School } from "../models/School";
import { Firebase } from "./FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class SchoolsService extends FirestoreServiceBase<ISchool, School> {
    protected readonly collectionRef = Firebase.firestore().collection("schools");

    protected mapDtoToModel(dto: ISchool): School {
        return new School(dto);
    }
}
