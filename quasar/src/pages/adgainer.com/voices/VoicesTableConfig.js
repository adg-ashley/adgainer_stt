import VoicesFields from './VoicesFields.js'

export default {
  config: {
    columnPicker: false,
    bodyStyle: {
      maxHeight: '500px'
    },
    rowHeight: '50px',
    responsive: true
  },
  columns: VoicesFields,
  pagination: false,
  bodyHeightProp: 'maxHeight',
  bodyHeight: 500
}
