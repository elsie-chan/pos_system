import Account, {isLockAccount} from "../models/account.model.js";
import {ErrorMessage} from "../errors/index.js";

async function deleteAll() {
    try {
        await Account.deleteMany({});
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

async function update(id, data) {
    try {
        const account = await Account.findById(id);
        if (!account) {
            return ErrorMessage(404, "Account not found")
        } else {
            const newUpdateAccount = account.updateOne({
                ...data
            })
            await newUpdateAccount.save();
            return newUpdateAccount;
        }
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

async function lockAccount(id) {
    try {
        const isLock = await isLockAccount(id)
        if (isLock) {
            return ErrorMessage(400, "Account is locked")
        } else {
            const account = await Account.findById(id);
            if (!account) {
                return ErrorMessage(404, "Account not found")
            } else {
                account.logging = true;
                await account.save();
                return account;
            }
        }
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}


export default {deleteAll, update, lockAccount};