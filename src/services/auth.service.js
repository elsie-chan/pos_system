import bcrypt from "bcrypt";
import Account, {findAccount, verifyAccount} from "../models/account.model.js";
import {AccountError, ErrorMessage} from "../errors/index.js";
import {generateRefreshToken, generateToken} from "../middleware/index.js";

async function createAccount(data) {
    try {
        const existAccount = await Account.findOne({
            email: data.email
        })
        if (existAccount) {
            return null;
        }
        const username = data?.email.split("@")[0];
        const defaultPassword = username;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);
        const token = generateToken(data);
        const refreshToken = generateRefreshToken(data);
        const newAccount = new Account({
            ...data,
            username: username,
            password: hashedPassword,
            token: token,
            refreshToken: refreshToken,
            avatar: "/images/avatar.png",
        });
        await newAccount.save();
        return newAccount;
    } catch (error) {
        throw new AccountError(error.message);
    }
}

async function authenticate(data) {
    return new Promise(async ( resolve, reject ) => {
        const isOk = verifyAccount(data);
        if (!isOk) {
            return reject(isOk);
        }

        return resolve(isOk);
    })
}

async function setActive(email) {
    const account = await Account.findOne({email: email});
    if (!account) {
        return null;
    } else {
        account.active = true;
        await account.save();
        return account;
    }
}

async function resetPassword(id, data) {
    try {
        const account = await Account.findById(id);
        if (!account) {
            return null;
        }
        const isMatch = await bcrypt.compare(account.password, data.newPassword);
        if (!isMatch) {
            return ErrorMessage(400, "New password must be different from old password");
        } else if (data.newPassword === data.confirmPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(data.newPassword, salt);
            account.password = hashedPassword;
            account.logging = true;
            await account.save();
            return account;
        } else {
            return ErrorMessage(400, "Password not match");
        }
    } catch (e) {
        return ErrorMessage(500, "Server errors", e);
    }
}

export default {createAccount, authenticate, setActive, resetPassword};