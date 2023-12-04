import { StatisticService } from '../../services/index.js';

class ApiStatisticController {

//     async getToday(req, res) {
//         try {
//             const statistic = await StatisticService.getToday();
//             return res.status(200).json(statistic)
//         } catch (e) {
//             return res.status(500).json({ message: e.message })
//         }
//     }
//
//     async getYesterday(req, res) {
//         try {
//             const statistic = await StatisticService.getYesterday();
//             return res.status(200).json(statistic)
//         } catch (e) {
//             return res.status(500).json({ message: e.message })
//         }
//     }
// }
    async getStatistics(req, res) {
        console.log(req.params.value)
        try {
            const statistic = await StatisticService.getStatisticInvoice(req.params.value);
            return res.status(200).json(statistic)
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

    async filterInvoice(req, res) {
        const from = req.query.from;
        const to = req.query.to;
        try {
            const statistic = await StatisticService.filterInvoiceBySpecificDate(from, to);
            return res.status(200).json(statistic)
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }
}

export default new ApiStatisticController()