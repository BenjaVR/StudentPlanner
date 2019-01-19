import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { IDepartment } from "../shared/contract/IDepartment";
import { ModelMapper } from "./ModelMapper";

admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({
    timestampsInSnapshots: true,
});

exports.onEducationDelete = functions.firestore.document("/educations/{id}").onDelete((snapShot) => {
    const educationId = snapShot.id;

    // Delete relations on departments
    const promise1 = firestore.collection("/departments")
        .get()
        .then((querySnapshot) => {
            const mappedDepartments = ModelMapper.mapDocsToObject<IDepartment>(querySnapshot.docs);
            mappedDepartments.forEach((department) => {
                const educations = department.capacityPerEducation;
                if (educations === undefined || educations === null || educations.length === 0) {
                    return;
                }

                if (educations.some((edu) => edu.educationId === educationId)) {
                    const updatedEducations = educations.filter((edu) => edu.educationId !== educationId);

                    const updatedDepartment: Partial<IDepartment> = {
                        capacityPerEducation: updatedEducations,
                    };
                    firestore.doc(`departments/${department.id}`).update(updatedDepartment);
                }
            });
        });

    return Promise.all([promise1]);
});
