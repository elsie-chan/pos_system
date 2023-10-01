import Account from "../models/account.model.js";

const deleteAll = async () => {
    await Account.deleteMany({});
}

const update = async (id, data) => {

}


export {deleteAll};