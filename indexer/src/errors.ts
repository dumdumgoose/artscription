export class Art20Error extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static wrap(error: any): Art20Error {
        if (error instanceof Error) {
            return new Art20Error(error.message);
        } else {
            return new Art20Error(JSON.stringify(error));
        }
    }
}
