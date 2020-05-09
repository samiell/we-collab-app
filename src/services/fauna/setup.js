import { getPage } from '@/services/fauna/index.js'
import { Base64 } from 'js-base64'

getPage().then(
    res => {
        if (!res.data.data || !res.data.data.getPage) {
            console.log(res.data)
        } else {
            dbDoc = res.data.data.getPage
            dbDoc.content = Base64.decode(dbDoc.content)
        }
    }
).catch(e => { console.log(e) })
export const dbDoc = getPage()