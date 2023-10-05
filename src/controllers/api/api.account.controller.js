import { AccountService } from '../../services/index.js'
class ApiAccountController {
    async deleteAll(req, res) {
        try {
            await AccountService.deleteAll()
            return res.status(200).json({ message: "Delete all account successfully" })
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default new ApiAccountController();