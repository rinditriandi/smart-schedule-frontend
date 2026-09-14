export const initial = (name) => {

    const newName = name.split(" ")

    const firstName = newName[0].substring(0, 1)
    const midleName = newName[1].substring(0, 1)
    const lastName = newName[2] !== undefined ? newName[2].substring(0, 1) : ''

    return firstName.concat(midleName).concat(lastName).toLowerCase()
}