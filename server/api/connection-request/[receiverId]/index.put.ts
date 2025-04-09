export default defineEventHandler(async(event) => {
    //authorize()
    const receiverId = getRouterParam(event, 'receiverId');
    const status = await getValidatedQuery<string>(event, (data) => {
        return 'status' in data && (data.status === 'Pending' || data.status === 'Accepted' || data.status === 'Rejected' || data.status === 'Withdrawn')
    })

})