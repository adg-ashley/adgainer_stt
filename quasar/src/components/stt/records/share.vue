<!-- 
share to email, etc . . . .
download as pdf, etc. . 
-->
<template>
  <div class="float-right ">
    <!--TODO: SHARE CONTENT-->
    <!-- <q-btn-dropdown class="q-mr-xs" no-caps dense outline color="secondary" label="Share">
        <q-list link dense>
          <q-item>
            <q-item-main>
              <q-item-tile label>Facebook</q-item-tile>
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main>
              <q-item-tile label>Twitters</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
    </q-btn-dropdown> -->
    <!-- <q-btn-dropdown class="q-my-xs" no-caps dense outline color="secondary" label="Download">
        <q-list link dense v-for="f in files" :key="f.name">
          <q-item @click.native="download(f)">
            <q-item-main>
              <q-item-tile label>{{f.name}}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
    </q-btn-dropdown> -->
  </div>
</template>
<script>
// import {mapGetters, mapActions} from 'vuex'
// import * as FileSaver from 'file-saver'
// import * as jsPDF from 'jspdf'
// export default {
//   props: {
//     record: {
//       type: Object
//     }
//   },
//   data () {
//     return {
//       files: [
//         { name: 'Plain Text', type: 'text/plain;charset=utf-8', extn: 'txt' },
//         { name: 'Rich Text', type: 'application/richtext;charset=utf-8', extn: 'rtf' },
//         { name: 'PDF', type: 'application/pdf', extn: 'pdf' },
//         { name: 'Docs', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8', extn: 'docx' }
//       ]
//     }
//   },
//   computed: {
//     ...mapGetters('STT/RECORD', ['Record'])
//   },
//   methods: {
//     ...mapActions('STT/RECORD', { downloadAs: 'download' }),
//     strip(html){
//       var doc = new DOMParser().parseFromString(html, 'text/html');
//       return doc.body.textContent || "";
//     },
//     download (f) {

//       if (f.extn === 'txt') {
//         let content = []
//         content.push(this.strip(this.Record.transcriptData))
//         const blob = new Blob(content, {type: f.type})
//         FileSaver.saveAs(blob, `${this.Record.name}.${f.extn}`)
//       } else if (f.extn === 'pdf') {
//         /// TODO: Page break
//         const margins = {
//           top: 60,
//           bottom: 60,
//           left: 40,
//           width: 522
//         }
//         const doc = new jsPDF('p', 'pt', 'letter')
//         var record = this.Record
//         doc.fromHTML(`<div>${record.transcriptData}</div>`, // HTML string or DOM elem ref.
//           margins.left, // x coord
//           margins.top, // y coord 
//           { width: margins.width },
//           function (dispose) {
//             doc.save(`${record.name}.${f.extn}`)
//           },
//           margins
//         )

       
//       } else if (f.extn === 'rtf') {
//         this.downloadAs({url: `stt/records/${this.Record.rid}/download`, data: { f }}).then((data) => {
//           const blob = new Blob([`${data}`], {type: f.type})
//           FileSaver.saveAs(blob, `${this.Record.name}.${f.extn}`)
//         })
//       } else if (f.extn === 'docx') {
//         this.downloadAs({url: `stt/records/${this.Record.rid}/download`, data: { f }}).then((data) => {
//           const blob = new Blob([`${data}`], {type: f.type})
//           FileSaver.saveAs(blob, `${this.Record.name}.${f.extn}`)
//         })
//       }
//     }
//   }
// }
</script>
