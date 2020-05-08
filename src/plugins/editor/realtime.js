import { keymap } from 'prosemirror-keymap'
import { Extension } from 'tiptap'
import { redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

const ydoc = new Y.Doc()
let room = 'live-wall'
const sharedSecret = "afreeworld"
let provider
if (process.isClient) {
    provider = new WebrtcProvider(
        room, ydoc, { maxConns: 70 + Math.floor(Math.random() * 70), password: sharedSecret }
    )

    provider.on('synced', synced => {
        console.log('synced!', synced)
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