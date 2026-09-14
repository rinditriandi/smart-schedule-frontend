export const titleCalendar = (resident, client, program, classTypeId, time) => {
    const rc = resident.length > 0 ? resident[0].alias : 'RC NOT SET'

    const title = `${rc} | ${time} | ${client} | ${program}`
    // const title = rc + " | " + client + " | " + program
    return title
}