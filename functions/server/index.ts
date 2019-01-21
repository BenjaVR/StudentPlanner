import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { IDepartment } from "../shared/contract/IDepartment";
import { IStudent } from "../shared/contract/IStudent";
import { ModelMapper } from "./ModelMapper";

admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({
    timestampsInSnapshots: true,
});

exports.onEducationDelete = functions.firestore.document("/educations/{id}").onDelete((snapShot) => {
    const educationId = snapShot.id;

    // Delete relations on departments
    const departmentsPromise = firestore.collection("/departments")
        .get()
        .then((querySnapshot) => {
            const innerPromises = [];

            const mappedDepartments = ModelMapper.mapDocsToObjects<IDepartment>(querySnapshot.docs);
            mappedDepartments.forEach((department) => {
                const educations = department.capacityPerEducation;
                if (educations === undefined || educations === null || educations.length === 0) {
                    return;
                }

                const updatedEducations = educations.filter((edu) => edu.educationId !== educationId);
                if (updatedEducations.length === 0) {
                    return;
                }

                if (educations.some((edu) => edu.educationId === educationId)) {

                    const updatedDepartment: Partial<IDepartment> = {
                        capacityPerEducation: updatedEducations,
                    };
                    innerPromises.push(firestore.doc(`/departments/${department.id}`).update(updatedDepartment));
                }
            });

            return Promise.all([innerPromises]);
        });

    return Promise.all([departmentsPromise]);
});

exports.onSchoolDelete = functions.firestore.document("/schools/{id}").onDelete((snapShot) => {
    const schoolId = snapShot.id;

    // Delete relations on students
    const studentsPromise = firestore.collection("/students")
        .where("schoolId", "==", schoolId)
        .get()
        .then((querySnapshot) => {
            const innerPromises = [];

            const mappedStudents = ModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
            mappedStudents.forEach((student) => {
                const schoolIdField: keyof IStudent = "schoolId";
                const updatedStudent = {
                    [schoolIdField]: admin.firestore.FieldValue.delete(),
                };
                innerPromises.push(firestore.doc(`/students/${student.id}`).update(updatedStudent));
            });

            return Promise.all([innerPromises]);
        });

    return Promise.all([studentsPromise]);
});
