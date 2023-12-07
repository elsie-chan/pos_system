import {AccountService, InvoiceService} from '../../services/index.js'
import {paginate} from "../../utils/index.js";
import {findAccount} from "../../models/account.model.js";

class ApiAccountController {
    async deleteAll(req, res) {
        try {
            await AccountService.deleteAll()
            return res.status(200).json({message: "Delete all account successfully"})
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

    async find(req, res) {
        try {
            console.log(req.body)
            const account = await AccountService.find(req.body)
            if (account == null) {
                return res.status(404).json({message: "Account not found"})
            }
            return res.status(200).json(account)
        } catch (e) {
            req.flash("errors", e.message)
        }
    }

    async getAll(req, res) {
        try {
            const page = req.query.page || 1
            const accounts = await AccountService.getAll()
            if (accounts == null) {
                return res.status(404).json({message: "No Accounts found"})
            } else {
                return paginate(accounts, page, 10)
            }
        } catch (e) {
            console.log(e)
            req.flash("errors", e.message)
            return res.status(500).json({message: e.message})
        }
    }
    async getOne(req, res) {
        try {
            const id = req.user.id;
            const account = await findAccount(id);
            if (account == null) {
                throw new Error("Account not found");
            }
            return account;  // Return the account data
        } catch (e) {
            console.log(e);
            throw e;  // Rethrow the error to be handled in the router
        }
    }

    async delete(req, res) {
        try {
            const account = await AccountService.deleteOne(req.params.id)
            if (account == null) {
                return res.status(404).json({message: "Account not found"})
            }
            return res.status(200).json({message: account})
        } catch (e) {
            console.log(e)
            req.flash("errors", e.message)
            return res.status(500).json({message: e.message})
        }
    }

    async update(req, res) {
        try {
            const account = await AccountService.update(req.params.id, req.body)
            if (account == null) {
                return res.status(404).json({message: account})
            }
            return res.status(200).json({message: account})
        } catch (e) {
            console.log(e)
            req.flash("errors", e.message)
            return res.status(500).json({message: e.message})
        }
    }

    async updateAvatar(req, res) {
        try {
            const data = {
                files: req.files,
                id: req.user.id
            }
            console.log(data)
            const updateAvatar = await AccountService.changeAvatar(data)
            console.log(updateAvatar)
            if (updateAvatar == null) {
                return res.status(404).json({message: "Account not found"})
            } else {
                return res.status(200).json({message: updateAvatar})
            }
        } catch (e) {
            console.log(e)
            req.flash("errors", e.message)
            return res.status(500).json({message: e.message})
        }
    }

    async lockAccount(req, res) {
        try {
            const account = await AccountService.lockAccount(req.params.id)
            if (account == null) {
                return res.status(404).json({message: "Account not found"})
            }
            if (account.status === 400) {
                return res.status(400).json({message: account.message})
            }
            return res.status(200).json({message: account})
        } catch (e) {
            console.log(e)
            req.flash("errors", e.message)
            return res.status(500).json({message: e.message})
        }
    }
}



export default new ApiAccountController();