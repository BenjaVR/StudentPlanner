import moment from "moment";

export function isMomentDayAfterOrTheSameAsOtherDay(date: moment.Moment | undefined, otherDate: moment.Moment | undefined): boolean {
    if (date === undefined || otherDate === undefined) {
        return false;
    }
    if (!date.isValid() || !date.isValid()) {
        return false;
    }

    return date.startOf("day").isSameOrAfter(otherDate.startOf("day"));
}
