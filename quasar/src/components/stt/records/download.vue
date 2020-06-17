<!-- 
share to email, etc . . . .
download as pdf, etc. . 
-->
<template>
  <div class="float-right ">
    <q-btn-dropdown size="md" @click.stop class="q-my-xs no-shadow" no-caps dense outline color="secondary" label="Download">
        <q-list class="no-shadow" link dense v-for="f in files" :key="f.name">
          <q-item @click.native="download(f)">
            <q-item-main>
              <q-item-tile label>{{f.name}}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
    </q-btn-dropdown>
  </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import * as FileSaver from 'file-saver'
import * as jsPDF from 'jspdf'
import Encoding from 'encoding-japanese'
export default {
  props: {
    record: {
      type: Object
    }
  },
  data () {
    return {
      files: [
        { name: 'Plain Text', type: 'text/plain;charset=utf-8', extn: 'txt' },
        { name: 'Rich Text', type: 'application/richtext;charset=sjis', extn: 'rtf' },
        { name: 'PDF', type: 'application/pdf', extn: 'pdf' },
        { name: 'Docs', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8', extn: 'docx' }
      ]
    }
  },
  methods: {
    ...mapActions('STT/RECORD', { downloadAs: 'download' }),
    strip(html){
      var doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    },
    download (f) {

      if (f.extn === 'txt') {
        let content = []
        content.push(this.strip(this.record.transcriptData))
        const blob = new Blob(content, {type: f.type})
        FileSaver.saveAs(blob, `${this.record.name}.${f.extn}`)
      } else if (f.extn === 'pdf') {
        /// TODO: Page break

        const doc = new jsPDF('p', 'pt', 'letter'),
          margins = {
            top: 60,
            bottom: 60,
            left: 40,
            width: 522
          }
        // closure   
        var rec = this.record
        doc.fromHTML(`<div>${rec.transcriptData}</div>`, // HTML string or DOM elem ref.
          margins.left, // x coord
          margins.top, // y coord 
          { width: margins.width },
          function (dispose) {
            doc.save(`${rec.name}.${f.extn}`)
          },
          margins
        )       
      } else if (f.extn === 'rtf') {
        this.downloadAs({url: `stt/records/${this.record.rid}/download`, data: { f }}).then((data) => {
        //   var unicodeString = Encoding.convert(data, {
        //     to: 'UNICODE',
        //     from: 'UTF8',
        //     type: 'string' // Specify 'string' type. (Return as string)
        //   });
         // console.log(data)
          //console.log(unicodeString); // こんにちは
          const blob = new Blob([`${data}`], {type: f.type})
          // console.log(blob)
          FileSaver.saveAs(blob, `${this.record.name}.${f.extn}`, true)
        })
      } else if (f.extn === 'docx') {
        this.downloadAs({url: `stt/records/${this.record.rid}/download`, data: { f }}).then((data) => {
          const blob = new Blob([`${data}`], {type: f.type})
          FileSaver.saveAs(blob, `${this.record.name}.${f.extn}`, true)
        })
      }
    }
  }
}
</script>
