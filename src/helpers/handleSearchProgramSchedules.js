import axios from '../lib/axios-ss.js'

let timeout

const handleSearchProgramSchedules = inputValue => {
  const currentUrl = window.location.pathname.split("/");
  const segment_1 = currentUrl[1];

  return new Promise(async (resolve, reject) => {
    try {
      clearTimeout(timeout)
      timeout = setTimeout(async () => {
        const options = {
          url: `/programSchedules?programschedule=${inputValue}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            appApiName: `scheduleSystem`,
            modApiName: `${segment_1}`,
            policy: `read`
          }
        }
        try {
          const { data } = await axios(options)
          resolve(data.data.map(item => {
            return {
              value: item.Id,
              label: `${item.Program_Schedule_Name__c}`
            }
          }))
        } catch(err) {
          resolve([])
        }
      }, 1500)
    } catch (err) {
      resolve([])
    }
  })
}

export default handleSearchProgramSchedules