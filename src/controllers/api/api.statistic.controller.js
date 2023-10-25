import { StatisticService } from '../../services/index.js';

class ApiStatisticController {

    async getToday(req, res) {
        try {
            const statistic = await StatisticService.getToday();
            return res.status(200).json(statistic)
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }
}

export default new ApiStatisticController()