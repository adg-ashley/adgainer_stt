export default [
  {
    label: 'Call Records',
    name: 'actions',
    align: 'center'
  },
  {
    name: 'phone_number',
    label: 'Tracking Number',
    field: 'phone_number',
    align: 'center'
  },
  {
    name: 'caller_number',
    label: 'Caller Number',
    field: 'caller_number',
    align: 'center'
  },
  {
    name: 'account_id',
    label: 'Account Id',
    field: (row) => {
      return row.account_id
    },
    align: 'center'
  },
  {
    name: 'account_name',
    label: 'Account Name',
    field: (row) => {
      if (row.AdAccount){
        return row.AdAccount.accountName 
      }
      else {
        return ''
      }
    },
    align: 'left'
  },
  {
    name: 'campaign_id',
    label: 'Campaign Id',
    field: (row) => {
      return row.campaign_id
    },
    align: 'center'
  },
  {
    name: 'campaign_name',
    label: 'Campaign Name',
    field: (row) => {
      if (row.AdCampaign){
        return row.AdCampaign.campaign_name 
      }
      else {
        return ''
      }
    },
    align: 'left'
  },
  /* {
    label: 'Caller Number',
    field: 'phone_time_use',
    format (PhoneTimeUse) {
      if (PhoneTimeUse) {
        return PhoneTimeUse.caller_phone
      }
    },
    align: 'center'
  },
  {
    label: 'Campaign Name',
    field: 'campaign',
    format (campaign) {
      return Campaign.campaign_name
    },
    align: 'center'
  },
  {
    label: 'Call Date',
    field: 'phone_time_use',
    format (PhoneTimeUse) {
      if (PhoneTimeUse) {
        return PhoneTimeUse.time_of_call
      }
    },
    align: 'center'
  },
  {
    label: 'Call Duration',
    field: 'phone_time_use',
    format (PhoneTimeUse) {
      if (PhoneTimeUse) {
        return PhoneTimeUse.call_duration
      }
    },
    align: 'center'
  },
  {
    label: 'Keyword',
    field: 'phone_time_use',
    format (PhoneTimeUse) {
      if (PhoneTimeUse) {
        return PhoneTimeUse.j_keyword
      }
    },
    align: 'center'
  }, */
]
