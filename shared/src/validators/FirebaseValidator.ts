export default class FirebaseValidator {
    public static hasId(value: { id?: string }) {
        return value.id !== undefined;
    }
}
