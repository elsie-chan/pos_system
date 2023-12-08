import bcrypt from "bcrypt";
import Account, {findAccount, verifyAccount} from "../models/account.model.js";
import {AccountError, ErrorMessage} from "../errors/index.js";
import {generateRefreshToken, generateToken} from "../utils/index.js";
import {Roles} from "../constants/roles.js";

async function createAccount(data) {
    try {
        const existAccount = await Account.findOne({
            email: data.email
        })
        if (existAccount) {
            return null;
        }
        console.log(data)
        const username = data?.email.split("@")[0];
        const defaultPassword = username;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);
        const token =await generateToken({
            username,
            role: Roles.STAFF
        });
        const refreshToken =await generateRefreshToken({
            username,
            role: Roles.STAFF
        });
        const newAccount = new Account({
            ...data,
            username: username,
            password: hashedPassword,
            token: token,
            refreshToken: refreshToken
        });
        await newAccount.save();
        return {
            ...newAccount._doc,
            password: undefined
        }
    } catch (error) {
        throw new AccountError(error.message);
    }
}

async function authenticate(data) {
    console.log(data)
    return new Promise(async (resolve, reject) => {
        const isOk = await verifyAccount(data);
        if (!isOk) {
            return reject(isOk);
        }

        return resolve(isOk);
    })
}

async function setActive(email) {
    try {
        const account = await Account.findOne({email: email});
        if (!account) {
            return null;
        } else {
            account.active = true;
            await account.save();
            return account;
        }
    } catch (e) {
        console.log(e)
        return ErrorMessage(500, "Server errors", e);
    }
}

async function resetPassword(id, data) {
    try {
        const account = await Account.findById(id);
        if (!account) {
            return null;
        }
        const isMatch = await bcrypt.compare(account.password, data.newPassword);
        if (isMatch) {
            return ErrorMessage(400, "New password must be different from old password");
        } else {
            console.log(data.newPassword)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(data.newPassword, salt);
            account.password = hashedPassword;
            account.logging = true;
            await account.save();
            return account;
        }
    } catch (e) {
        return ErrorMessage(500, "Server errors", e);
    }
}

async function changePassword(data) {
    try {
        const account = await Account.findById(data.id);
        if (!account) {
            return ErrorMessage(400, "Account not found");
        }
        if (data.newPassword !== data.confirmPassword) {
            return ErrorMessage(400, "Confirm password is not match");
        }
        const isMatch1 = await bcrypt.compare(data.oldPassword, account.password);
        if (!isMatch1) {
            return ErrorMessage(400, "Current password is incorrect");
        }
        const isMatch = await bcrypt.compare(data.newPassword, account.password);
        console.log(data.oldPassword, data.newPassword)
        console.log(isMatch)
        if (isMatch) {
            return ErrorMessage(400, "New password must be different from old password");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.newPassword, salt)
        const accountAfterChangePassword = await Account.findByIdAndUpdate({
                _id: data.id
            },
            {
                $set: {
                    password: hashedPassword
                }
            })
        if (accountAfterChangePassword == null) {
            return null
        }
        return accountAfterChangePassword;
    } catch (e) {
        console.log(e)
        return e.message;
    }
}

export default {createAccount, authenticate, setActive, resetPassword, changePassword};
