import { ISchool } from "shared/dist/models/School";
import { Firebase } from "../../config/FirebaseInitializer";

export class FirebaseFunctions {

    public static addSchool(data: {school: ISchool}): Promise<void> {
        return Firebase.functions().httpsCallable("addSchool")(data)
            .then(() => {
                // TODO
            });
    }
}
