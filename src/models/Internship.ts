import moment from "moment";
import { IInternship } from "../entities/IInternship";
import { Firebase } from "../services/FirebaseInitializer";
import { ModelBase } from "./ModelBase";

export class Internship extends ModelBase<IInternship> {

    constructor(
        public startDate: moment.Moment,
        public endDate: moment.Moment,
        public hours: number,
        public isArchived: boolean,
        public studentId: string,
        public departmentId: string | undefined,
    ) {
        super();
    }

    public static fromEntity(entity: IInternship): Internship {
        const internship = new Internship(
            moment(entity.startDate.toDate()),
            moment(entity.endDate.toDate()),
            entity.hours || 0,
            entity.isArchived || false,
            entity.studentId!,
            entity.departmentId,
        );
        internship.fillBaseFields(entity);
        return internship;
    }

    protected getEntityInternal(): IInternship {
        return {
            startDate: Firebase.firestore.Timestamp.fromDate(
                this.startDate.startOf("day").toDate(),
            ),
            endDate: Firebase.firestore.Timestamp.fromDate(
                this.endDate.startOf("day").toDate(),
            ),
            hours: this.hours,
            isArchived: this.isArchived,
            studentId: this.studentId,
            departmentId: this.departmentId,
        };
    }
}
