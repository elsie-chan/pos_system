class AccountError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AccountError';
        this.status = 400;
    }
}

export default AccountError;