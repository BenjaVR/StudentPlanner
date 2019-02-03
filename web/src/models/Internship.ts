import moment from "moment";
import { IInternship } from "../entities/IInternship";
import { isMomentDayAfterOtherDay } from "../helpers/comparers";
import { Firebase } from "../services/FirebaseInitializer";
import { ModelBase } from "./ModelBase";

export class Internship extends ModelBase<IInternship> {

    constructor(
        public startDate: moment.Moment,
        public endDate: moment.Moment,
        public hours: number,
        public studentId: string,
        public departmentId: string,
    ) {
        super();
        this.validateFields();
    }

    public static fromEntity(entity: IInternship): Internship {
        return new Internship(
            moment.utc(entity.startDate.toDate()),
            moment.utc(entity.endDate.toDate()),
            entity.hours || 0,
            entity.studentId!,
            entity.departmentId!,
        );
    }

    protected getEntityInternal(): IInternship {
        const entity = {
            startDate: Firebase.firestore.Timestamp.fromDate(
                moment.utc(this.startDate.toDate()).startOf("day").toDate(),
            ),
            endDate: Firebase.firestore.Timestamp.fromDate(
                moment.utc(this.endDate.toDate()).startOf("day").toDate(),
            ),
            hours: this.hours,
            studentId: this.studentId,
            departmentId: this.departmentId,
        };
        return entity;
    }

    protected validateFields(): Promise<void> {
        try {
            if (this.startDate === undefined) {
                throw new Error("startDate is undefined");
            }
            if (this.endDate === undefined) {
                throw new Error("endDate is undefined");
            }
            if (!isMomentDayAfterOtherDay(this.endDate, this.startDate)) {
                throw new Error("endDate should be later than startDate");
            }
            if (this.studentId === undefined) {
                throw new Error("studentId is undefined");
            }
            if (this.departmentId === undefined) {
                throw new Error("departmentId is undefined");
            }
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
