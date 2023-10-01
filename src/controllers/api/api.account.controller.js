import { deleteAll } from '../../services/account.service.js'
class ApiAccountController {
    async deleteAll(req, res) {
        await deleteAll()
        return res.status(200).json({ message: "Delete all account successfully" })
    }
}

export default new ApiAccountController();