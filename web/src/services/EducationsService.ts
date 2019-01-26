import { IEducation } from "studentplanner-functions/shared/contract/IEducation";
import { Education } from "../models/Education";
import { Firebase } from "./FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class EducationsService extends FirestoreServiceBase<IEducation, Education> {
    protected readonly collectionRef = Firebase.firestore().collection("educations");

    protected mapDtoToModel(dto: IEducation): Education {
        return new Education(dto);
    }
}
