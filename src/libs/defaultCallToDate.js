export const createDefaultDate = () => {
    const defaultDate = new Date()
    return defaultDate.setMonth(defaultDate.getMonth() + 6)
}