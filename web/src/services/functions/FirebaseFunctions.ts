import firebase from "firebase";
import { ISchool } from "shared/dist/models/School";
import { Firebase } from "../../config/FirebaseInitializer";

export class FirebaseFunctions {

    public static addSchoolFunction(data: { school: ISchool }): Promise<firebase.functions.HttpsCallableResult> {
        return Firebase.functions().httpsCallable("addSchool")(data);
    }
}
