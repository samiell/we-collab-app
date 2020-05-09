import { keymap } from 'prosemirror-keymap'
import { Extension } from 'tiptap'
import { redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { getPage, updatePage } from '@/services/fauna/index.js'
import { Base64 } from 'js-base64'

let dbDoc, provider;
let count = 0
count++
const ydoc = new Y.Doc()

if (process.isClient) {
    provider = new WebrtcProvider(
        'live-wall', ydoc, {
            maxConns: 70 + Math.floor(Math.random() * 70),
            password: 'afreeworld'
        }
    )

    provider.on('synced', synced => {
        console.log('synced!', synced)
    })

    ydoc.on('beforeTransaction', async update => {
        if (count === 1) {
            await getPage().then(
                res => {
                    if (!res.data.data || !res.data.data.getPage) {
                        console.log(res.data)
                    } else {
                        dbDoc = res.data.data.getPage
                        dbDoc.content = Base64.decode(dbDoc.content)
                    }
                    console.log(dbDoc)
                }
            ).catch(e => { console.log(e) })
            Y.applyUpdate(ydoc, dbDoc)
            count++
        }
    })

    ydoc.on('update', update => {
        dbDoc.content = Base64.encode(Y.encodeStateAsUpdate(ydoc))
        updatePage(dbDoc)
        console.log('updated')
    })
}
const type = ydoc.getXmlFragment('prosemirror')

export default class Realtime extends Extension {
    get name() {
        return 'realtime'
    }

    get plugins() {
        return [
            ySyncPlugin(type),
            yCursorPlugin(provider.awareness),
            yUndoPlugin(),
            keymap({
                'Mod-z': undo,
                'Mod-y': redo,
                'Mod-Shift-z': redo
            })
        ]
    }
}