import moment from 'moment'
import 'moment/locale/vi'

const formatDate = (date) => {

    const formatDate = date.indexOf("0Z") != -1 ? new Date(date).toISOString().substring(0, 19) : date
    const time = new Date(formatDate).getTime() /1000
    const timeNow = new Date().getTime() / 1000

    if (timeNow - time <= 3600) {
        if (date.indexOf("0Z") != -1) {
            return moment(new Date(date).toISOString().substring(0, 19)).fromNow()
        } else {
            return moment(date).fromNow()
        }
    }

    if (timeNow - time <= 86400) {
        if (date.indexOf("0Z") != -1) {
            return moment(new Date(date).toISOString().substring(0, 19)).format("llll")
        } else {
            return moment(date).format("llll")
        }
    }
    if (date.indexOf("0Z") != -1) {
        return moment(new Date(date).toISOString().substring(0, 19), "DD-MM-YYYY").format('L')
    } else {
        return moment(date, "DD-MM-YYYY").format('L')
    }
}

export default formatDate