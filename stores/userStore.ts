import type { IUser } from "~/server/models/User";


export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as IUser | null,
        error: null as {} | null
    }),
    actions: {
        async fetchUser() {
            const {data, error} = await useFetch('/api/profile', {method: "GET"});
            if(error.value) {
                console.error(error.value);
                this.error = error.value
            }
            if(data.value) {
                this.user = data.value;
            }
        }
    }
})