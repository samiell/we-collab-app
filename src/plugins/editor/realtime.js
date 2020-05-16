import { keymap } from 'prosemirror-keymap'
import { Extension } from 'tiptap'
import { redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { updatePage } from '@/services/fauna/index.js'
import { fromBase64, toBase64 } from '@aws-sdk/util-base64-browser'

const ydoc = new Y.Doc()
const initYDoc = (page) => {
    if (process.isClient) {
        if (
            typeof page.content === 'string' &&
            page.content.length !== 0
        ) {
            this.page.content = fromBase64(this.page.content)
            Y.applyUpdate(ydoc, page.content)
        }
        ydoc.on('update', update => {
            page.content = toBase64(Y.encodeStateAsUpdate(ydoc))
            updatePage(page)
        })
        return ydoc.getXmlFragment('prosemirror')
    }
}

const initProvider = (page) => {
    if (process.isClient) {
        const provider = new WebrtcProvider(
            page.room, ydoc, {
                password: page.secret,
                maxConns: 70 + Math.floor(Math.random() * 70),
            }
        )
        return provider.awareness
    }
}

export default class Realtime extends Extension {
    get name() {
        return 'realtime'
    }

    get defaultOptions() {
        return {
            pageDoc: {}
        }
    }
    get plugins() {
        console.log(this.options)
        return [
            ySyncPlugin(initYDoc(this.options.pageDoc)),
            yCursorPlugin(initProvider(this.options.pageDoc)),
            yUndoPlugin(),
            keymap({
                'Mod-z': undo,
                'Mod-y': redo,
                'Mod-Shift-z': redo
            })
        ]
    }
}