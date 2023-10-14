import Account, {isLockAccount} from "../models/account.model.js";
import {ErrorMessage} from "../errors/index.js";

async function deleteAll() {
    try {
        await Account.deleteMany();
        return "Delete all account successfully";
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

async function find(data) {
    try {
        const account = await Account.find({
            ...data
        }).select("-password");
        if (!account) {
            return null
        } else {
            return account;
        }
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

async function getAll() {
    try {
        const data = await Account.find()
            .select("-password")
        if (data == null) {
            return null
        }
        return data
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

async function update(data) {
    try {
        const account = await Account.findOneAndUpdate({
                _id: data._id
            },
            {
                $push: {
                    invoices: {
                        $each: [data.invoices],
                        $position: 0
                    }
                }
            })
        if (account == null) {
            return null
        } else {
            return account
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

async function deleteOne(id) {
    try {
        const account = await Account.findById(id);
        if (!account) {
            return ErrorMessage(404, "Account not found")
        } else {
            await account.deleteOne();
            return "Delete account successfully";
        }
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

async function changeAvatar(data) {
    try {
        const account = await Account.findById(data.id);
        if (!account) {
            return null
        }
        if (!data.files) {
            return ErrorMessage(400, "File not found");
        }
        const files = data.files[0]
        account.avatar = files.filename
        await account.save()
        return account;
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

export default {
    deleteAll,
    deleteOne,
    update,
    changeAvatar,
    lockAccount,
    find,
    getAll
};