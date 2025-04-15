import { useUserStore } from "~/stores/userStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { loggedIn } = useOidcAuth();
    if(loggedIn.value) {
        const pinia = usePinia();
        const userStore = useUserStore(pinia);
        if(!userStore.user._id){
            await userStore.fetchUser();
        }
        if(userStore.user._id && !userStore.user.registrationCompleted) {
            if(to.path.startsWith('/register')){
                return
            } else {
                return navigateTo('/register/page_1');
            }
        }
    }

})
