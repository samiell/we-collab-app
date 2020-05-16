import { guest, page, url } from "./config"
import { updatePageMutation } from "./mutation"
import { getPageQuery } from './query'
import axios from 'axios'

export const updatePage = (dataPayload) => {
    return axios({
        method: 'post',
        url,
        headers: {
            "authorization": `Bearer ${guest}`
        },
        data: {
            query: updatePageMutation(dataPayload)
        }
    })
}

export const getPage = async() => {
    return await axios({
        method: 'post',
        url,
        headers: {
            "authorization": `Bearer ${guest}`
        },
        data: {
            query: getPageQuery(page)
        }
    })
}