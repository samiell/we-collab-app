import { keymap } from 'prosemirror-keymap'
import { Extension } from 'tiptap'
import { redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { updatePage } from '@/services/fauna/index.js'
import { fromBase64, toBase64 } from '@aws-sdk/util-base64-browser'

export default class Realtime extends Extension {
    get name() {
        return 'realtime'
    }

    get defaultOptions() {
        return {
            pageDoc: {},
            type: null,
            provider: null
        }
    }
    init() {
        const ydoc = new Y.Doc()

        if (
            typeof this.options.pageDoc.content === 'string' &&
            this.options.pageDoc.content.length !== 0
        ) {
            this.options.pageDoc.content = fromBase64(this.options.pageDoc.content)
            Y.applyUpdate(ydoc, this.options.pageDoc.content)
        }

        ydoc.on('update', update => {
            this.options.pageDoc.content = toBase64(Y.encodeStateAsUpdate(ydoc))
            updatePage(this.options.pageDoc)
        })

        this.options.provider = new WebrtcProvider(
            this.options.pageDoc.room, ydoc, {
                password: this.options.pageDoc.secret,
                maxConns: 40 + Math.floor(Math.random() * 30),
            }
        )
        this.options.type = ydoc.getXmlFragment('prosemirror')
    }

    get plugins() {
        return [
            ySyncPlugin(this.options.type),
            yCursorPlugin(this.options.provider.awareness),
            yUndoPlugin(),
            keymap({
                'Mod-z': undo,
                'Mod-y': redo,
                'Mod-Shift-z': redo
            })
        ]
    }
}