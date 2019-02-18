import { IDepartment } from "../../entities/IDepartment";
import { nameof } from "../../helpers/nameof";
import { Department } from "../../models/Department";
import { Education } from "../../models/Education";
import { FirebaseModelMapper } from "../FirebaseModelMapper";
import { FirestoreRefs } from "../FirestoreRefs";
import { StudentsRepository } from "./StudentsRepository";

export class DepartmentsRepository {

    public static subscribeToDepartments(onListen: (departments: Department[]) => void): () => void {
        return FirestoreRefs.getDepartmentCollectionRef()
            .orderBy(nameof<IDepartment>("createdTimestamp"), "desc")
            .onSnapshot((querySnapshot) => {
                const departmentEntities = FirebaseModelMapper.mapDocsToObjects<IDepartment>(querySnapshot.docs);
                const departments = departmentEntities.map((entity) => Department.fromEntity(entity));
                onListen(departments);
            });
    }

    public static async getAllDepartments(): Promise<Department[]> {
        const querySnapshot = await FirestoreRefs.getDepartmentCollectionRef()
            .get();

        const departmentEntities = FirebaseModelMapper.mapDocsToObjects<IDepartment>(querySnapshot.docs);
        const departments = departmentEntities.map((entity) => Department.fromEntity(entity));
        return departments;
    }

    public static async getDepartmentsByName(): Promise<Department[]> {
        const querySnapshot = await FirestoreRefs.getDepartmentCollectionRef()
            .orderBy(nameof<IDepartment>("name"), "asc")
            .get();

        const departmentEntities = FirebaseModelMapper.mapDocsToObjects<IDepartment>(querySnapshot.docs);
        const departments = departmentEntities.map((entity) => Department.fromEntity(entity));
        return departments;
    }

    public static async addDepartment(department: Department): Promise<void> {
        await FirestoreRefs.getDepartmentCollectionRef()
            .add(department.getEntity("new"));
    }

    public static async updateDepartment(department: Department, doNotUpdateTimestamp: boolean = false): Promise<void> {
        if (department.id === undefined) {
            return Promise.reject(Error("Department should have an id"));
        }
        await FirestoreRefs.getDepartmentDocRef(department.id)
            .update(department.getEntity(doNotUpdateTimestamp ? "updateWithoutTime" : "update"));
    }

    public static async deleteDepartment(department: Department): Promise<void> {
        if (department.id === undefined) {
            return Promise.reject(Error("Department should have an id"));
        }
        await FirestoreRefs.getDepartmentDocRef(department.id)
            .delete();

        // Delete relations with internships on students
        const plannedStudents = await StudentsRepository.getPlannedStudentsWithDepartment(department);
        plannedStudents.forEach(async (student) => {
            if (student.internship === undefined) {
                return;
            }
            student.internship.departmentId = undefined;
            StudentsRepository.updateStudent(student, true);
        });
    }

    public static async deleteEducationRelations(education: Education): Promise<void> {
        const departments = await DepartmentsRepository.getAllDepartments();
        departments.forEach(async (department) => {
            const educations = department.capacityPerEducation;
            if (educations === undefined || educations === null || educations.length === 0) {
                return;
            }
            if (educations.some((edu) => edu.educationId === education.id)) {
                const educationsToKeep = educations.filter((edu) => edu.educationId !== education.id);
                department.capacityPerEducation = educationsToKeep;
                await DepartmentsRepository.updateDepartment(department, true);
            }
        });
    }
}
