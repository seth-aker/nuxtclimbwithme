const pageOrder = [
    {route: '/profile', name: 'profile', order: 5},
    {route: '/messaging', name: 'messaging', order: 4},
    {route: '/search', name: 'search', order: 3},
    {route: '/friends', name: 'friends', order: 2},
    {route: '/', name: 'index', order: 1}, 
 ]
export default defineNuxtRouteMiddleware((to, from) => {
    if (to.meta.pageTransition && typeof to.meta.pageTransition !== 'boolean' && from.meta.pageTransition && typeof from.meta.pageTransition !== 'boolean') {
        const toPage = pageOrder.find((page) => to.path.startsWith(page.route));
        const fromPage = pageOrder.find((page) => from.path.startsWith(page.route));
        if(!toPage || !fromPage) {
            return;
        }
        to.meta.pageTransition.name = toPage.order > fromPage.order ? 'slide-left' : 'slide-right'
        from.meta.pageTransition.name = toPage.order > fromPage.order ? 'slide-left' : 'slide-right'
    }
})