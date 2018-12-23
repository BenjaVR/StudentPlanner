import { IFirebaseFunctionParam } from "@studentplanner/functions/dist/shared/firebase/interfaces";
import { Firebase } from "../../config/FirebaseInitializer";
import { ISchool } from "@studentplanner/functions/dist/shared/models/School";

export class FirebaseFunctions {

    public static addSchoolFunction(data: IFirebaseFunctionParam<ISchool>): Promise<ISchool> {
        return new Promise<ISchool>((resolve, reject) => {
            Firebase.functions().httpsCallable("addSchool")(data)
                .then((result) => {
                    resolve(result.data);
                })
                .catch(reject);
        });
    }
}
