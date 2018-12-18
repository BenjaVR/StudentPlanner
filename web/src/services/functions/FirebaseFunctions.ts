import { ISchool } from "@studentplanner/functions/dist/shared/models/School";
import firebase from "firebase";
import { Firebase } from "../../config/FirebaseInitializer";

export class FirebaseFunctions {

    public static addSchoolFunction(data: { school: ISchool }): Promise<firebase.functions.HttpsCallableResult> {
        return Firebase.functions().httpsCallable("addSchool")(data);
    }
}
