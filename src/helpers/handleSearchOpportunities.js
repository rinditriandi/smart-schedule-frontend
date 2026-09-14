import axios from '../lib/axios-ss.js'

let timeout

const handleSearchOpportunities = inputValue => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  return new Promise(async (resolve, reject) => {
    try {
      clearTimeout(timeout)
      timeout = setTimeout(async () => {
        const options = {
          url: `/opportunities?opportunity=${inputValue}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            appApiName: `scheduleSystem`,
            modApiName: `${segment_1}`,
            policy: `read`
          }
        }
        const { data } = await axios(options)
        resolve(data.data.map(item => {
          return {
            value: item.Id,
            label: `${item.Name} ${item?.Program_Name__c || ''} ${item?.Program_Start_Date__c} s/d ${item?.Program_End_Date__c}`
          }
        }))
      }, 1500)
    } catch (err) {
      console.log(err?.response?.data || err)
    }
  })
}

export default handleSearchOpportunities