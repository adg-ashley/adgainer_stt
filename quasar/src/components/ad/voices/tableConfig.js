import columns from './columns.js'

export default {
  config: {
    columnPicker: false,
    bodyStyle: {
      maxHeight: '500px'
    },
    rowHeight: '50px',
    responsive: true
  },
  columns: columns,
  pagination: false,
  bodyHeightProp: 'maxHeight',
  bodyHeight: 500
}
