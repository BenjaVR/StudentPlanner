import { IDepartment } from "../entities/IDepartment";
import { nameof } from "../helpers/nameof";
import { Department } from "../models/Department";
import { FirebaseModelMapper } from "./FirebaseModelMapper";
import { FirestoreRefs } from "./FirestoreRefs";

export class DepartmentsRepository {

    public static subscribeToDepartments(onListen: (departments: Department[]) => void): () => void {
        return FirestoreRefs.getDepartmentCollectionRef().onSnapshot((querySnapshot) => {
            const departmentEntities = FirebaseModelMapper.mapDocsToObjects<IDepartment>(querySnapshot.docs);
            const departments = departmentEntities.map((entity) => Department.fromEntity(entity));
            onListen(departments);
        });
    }

    public static async getDepartments(): Promise<Department[]> {
        const querySnapshot = await FirestoreRefs.getDepartmentCollectionRef()
            .orderBy(nameof<Department>("updatedDate"), "desc")
            .get();

        const departmentEntities = FirebaseModelMapper.mapDocsToObjects<IDepartment>(querySnapshot.docs);
        const departments = departmentEntities.map((entity) => Department.fromEntity(entity));
        return departments;
    }

    public static async addDepartment(department: Department): Promise<void> {
        await FirestoreRefs.getDepartmentCollectionRef()
            .add(department.getEntity("new"));
    }

    public static async updateDepartment(department: Department): Promise<void> {
        if (department.id === undefined) {
            return Promise.reject(Error("Department should have an id"));
        }
        await FirestoreRefs.getDepartmentDocRef(department.id)
            .update(department.getEntity("update"));
    }

    public static async deleteDepartment(department: Department): Promise<void> {
        if (department.id === undefined) {
            return Promise.reject(Error("Department should have an id"));
        }
        await FirestoreRefs.getDepartmentDocRef(department.id)
            .delete();
    }
}
