import type { IUser as IMongoUser } from "~/server/models/User";

export interface IUser extends Omit<IMongoUser, '_id' | 'connections' | 'requestsSent' | 'requestsReceived' | 'blocked' | 'createdAt' | 'updatedAt'>{
    _id: string,
    connections: string[],
    requestsSent: string[],
    requestsReceived: string[],
    blocked: string[],
    createdAt?: string | undefined,
    updatedAt?: string | undefined
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {} as IUser,
        error: null as {} | null
    }),
    actions: {
        async fetchUser() {
            this.error = null;
            const {data, error} = await useFetch('/api/profile', {method: "GET"});
            if(error.value) {
                console.error(error.value);
                this.error = error.value
            }
            if(data.value) {
                this.user = data.value;
            }
        },
        async updateUser(user: IUser) {
            this.error = null;
            const response =  await $fetch(`/api/users/${user._id}`, {method: "PUT", body: user});
            if(response) {
                this.user = response;
            } else {
                this.error = "There was an error updating the user."
            }
        },
        async updateProfilePicture(formData: FormData) {
            this.error = null;
            const response = await $fetch("/api/profile/image", {method: "POST", body: formData})
            if(response.status !== 200) {
                this.error = "There was an error updating the profile image."
            }
        }
    }
})
