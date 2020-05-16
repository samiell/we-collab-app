<template>
  <Layout>
    <v-container fluid>
      <v-row class="mx-auto mt-6">
        <v-col class="headline text-center" cols="12">
            Content Collaboration
          </v-col>
          <ClientOnly>
            <v-col class="mx-auto" md="8" offset-md="2" v-if="editor">
              <editor-menu-bar class="mx-auto" :editor="editor" v-slot="{ commands, isActive }">
                <v-btn-toggle dark multiple>

                  <v-btn
                    :class="{ 'is-active': isActive.bold() }"
                    @click="commands.bold"
                  >
                    b
                  </v-btn>
                  <v-btn
                    :class="{ 'is-active': isActive.italic() }"
                    @click="commands.italic"
                  >
                    i
                  </v-btn>
                  <v-btn
                    :class="{ 'is-active': isActive.strike() }"
                    @click="commands.strike"
                  >
                    strike
                  </v-btn>
                  <v-btn
                    :class="{ 'is-active': isActive.underline() }"
                    @click="commands.underline"
                  >
                    u
                  </v-btn>

                  <v-btn
                    
                    :class="{ 'is-active': isActive.code() }"
                    @click="commands.code"
                  >
                    code
                  </v-btn>
                  <v-btn
                    
                    :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                    @click="commands.heading({ level: 1 })"
                  >
                    H1
                  </v-btn>

                  <v-btn
                    
                    :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                    @click="commands.heading({ level: 2 })"
                  >
                    H2
                  </v-btn>

                  <v-btn
                    
                    :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                    @click="commands.heading({ level: 3 })"
                  >
                    H3
                  </v-btn>

                  <v-btn
                    
                    :class="{ 'is-active': isActive.bullet_list() }"
                    @click="commands.bullet_list"
                  >
                    ul
                  </v-btn>

                  <v-btn
                    
                    :class="{ 'is-active': isActive.ordered_list() }"
                    @click="commands.ordered_list"
                  >
                    ol
                  </v-btn>

                  <v-btn
                    
                    :class="{ 'is-active': isActive.blockquote() }"
                    @click="commands.blockquote"
                  >
                    quote
                  </v-btn>

                  <v-btn
                    
                    :class="{ 'is-active': isActive.code_block() }"
                    @click="commands.code_block"
                  >
                    code Block
                  </v-btn>

                  <v-btn
                    
                    @click="commands.undo"
                  >
                    undo
                  </v-btn>

                  <v-btn
                    
                    @click="commands.redo"
                  >
                    redo
                  </v-btn>

                </v-btn-toggle>
              </editor-menu-bar>

              <editor-content class="editor" :editor="editor"/>
          </v-col>
        </ClientOnly>
      </v-row>
    </v-container>
  </Layout>
</template>


<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import { 
  Blockquote, Bold, BulletList, Code, CodeBlock, HardBreak, 
  Heading, History, HorizontalRule, Italic, Link, ListItem, 
  OrderedList, Strike, TodoItem, TodoList, Underline 
} from 'tiptap-extensions'
import Realtime from '@/plugins/editor/realtime.js'
import { getPage } from '@/services/fauna/index.js'

export default {
  metaInfo: {
    title: "WeCollab"
  },
  components: {
    EditorContent,
    EditorMenuBar,
  },
  data() {
    return {
      editor: null,
      page: null
    }
  },
  async mounted() {
    await getPage().then(
        res => {
            if (!res.data.data || !res.data.data.getPage) {
                // handle error
            } else {
                this.page = res.data.data.getPage
                console.log(this.page)
            }
        }
    ).catch(e => {
      // handle error
    })
    if(process.isClient && this.page) {
      this.editor = new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Realtime({pageDoc: this.page})
        ],
      })
    }
    console.log(this.page)
    console.log(this.editor)
  },
  beforeDestroy() {
    if(this.editor && process.isClient) this.editor.destroy()
  }
}
</script>


<style>
.ProseMirror {
  height: 100%;
  padding: 12px;
  border: 1px  solid #cecccc;
}
.ProseMirror-focused {
  text-decoration: none;
  background-color: rgba(240, 240, 240, 0.801);
  outline-style: none;
}
.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="true"] {
  white-space: pre-wrap;
}
.editor h2, h3 {
  margin: 10px 0 20px !important;
}
      
.editor blockquote {
  border-left: .25em solid #707070;
  color: #6a737d;
  padding-left: 1em;
  margin: 20px 0 !important;
}
      
.editor pre code {
  width: 100%;
  display: block;
}
.editor pre, .editor p code {
  border-radius: 5px;
}
        
.editor code:before, .editor code:after {
  content: none;
  letter-spacing: initial;
}
      
.editor p {
  margin-top: 16px !important;
  margin-bottom: 16px !important;
  min-height: 1rem;
}
.editor {
  position: relative;
}

.editor p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaaaaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}


.editor .resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
.v-application .editor code {
  background-color: #000000;
  color: #f59f77;
  padding: 1em;
}
.v-application .editor p code {
  background-color:#fbe5e1;
  color:#c0341d;
  padding: 1px 5px;
}
.v-application.editor code:after, 
.v-application.editor code:before, 
.v-application.editor kbd:after, 
.v-application.editor kbd:before {
  content: "";
}
.editor pre::before {
  content: attr(data-language);
  text-transform: uppercase;
  display: block;
  text-align: right;
  font-weight: bold;
  font-size: 0.6rem;
}
placeholder {
  display: inline;
  border: 1px solid #ccc;
  color: #ccc;
}
placeholder:after {
  content: "☁";
  font-size: 200%;
  line-height: 0.1;
  font-weight: bold;
}
.ProseMirror img { max-width: 100px }

.ProseMirror > .ProseMirror-yjs-cursor:first-child {
  margin-top: 16px;
}
.ProseMirror p:first-child, .ProseMirror h1:first-child, .ProseMirror h2:first-child, .ProseMirror h3:first-child, .ProseMirror h4:first-child, .ProseMirror h5:first-child, .ProseMirror h6:first-child {
  margin-top: 16px
}
.ProseMirror-yjs-cursor {
  position: absolute;
  border-left: black;
  border-left-style: solid;
  border-left-width: 2px;
  border-color: rgb(255, 30, 0);
  height: 1em;
  word-break: normal;
  pointer-events: none;
}
.ProseMirror-yjs-cursor > div {
  position: relative;
  top: -1.05em;
  font-size: 13px;
  background-color: rgb(255, 30, 0);
  font-family: serif;
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  user-select: none;
  color: white;
  padding-left: 2px;
  padding-right: 2px;
}
#y-functions {
  position: absolute;
  top: 20px;
  right: 20px;
}
#y-functions > * {
  display: inline-block;
}
</style>
