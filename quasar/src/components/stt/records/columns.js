import moment from 'moment'

export default [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    class: 'ellipsis',
    width: '20%',
  },
  {
    label: 'Transcript',
    name: 'transcript',
    field: 'transcriptData',
    format (transcriptData) {
      let doc = new DOMParser().parseFromString(transcriptData, 'text/html');
      let str = doc.body.textContent || ''
      if (str.length > 48) {
        str = str.substring(0, 48) + ' ...'
      }
      return  str
    },
    width: '20%',
    class: 'ellipsis',
    align: 'left'
  },
  {
    name: 'updatedAt',
    label: 'Last Modified',
    field: 'updatedAt',
    align: 'left',
    format (updatedAt) {
      //return moments(updatedAt, 'YYYYMMDD')
      //return updatedAt 
      //return moment(updatedAt).format('MMMM Do YYYY, h:mm:ss').year()
      
      //return a.year() //a.from(moment()) //.startOf('hour').fromNow()
      return moment(updatedAt, 'YYYYMMDD hh:mm:ss +Z').fromNow()
    },
    width: '30%',
    class: 'ellipsis'
  },
  {
    label: '',
    name: 'action',
    align: 'right'
  }
  // {
  //   label: 'Transcript',
  //   name: 'transcript',
  //   align: 'center',
  //   width: '5%'
  // },
  // {
  //   label: 'Source',
  //   field: 'source',
  //   name: 'source',
  //   align: 'center',
  //   width: '10%'
  // },
  // {
  //   label: 'Save Date',
  //   field: 'createdAt',
  //   format (CreatedAt) {
  //     return moment(CreatedAt).format('MMMM Do YYYY, h:mm:ss a')
  //   },
  //   align: 'center',
  //   width: '15%'
  // },
  // {
  //   label: 'Actions',
  //   name: 'actions',
  //   align: 'center',
  //   width: '5%'
  // }
]
