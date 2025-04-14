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
            const {data, error} = await useFetch(`/api/users/${user._id}`, {method: "PUT", body: user});
            if(error.value) {
                console.error(error.value);
                this.error = error.value
                return error.value
            }
            if(data.value) {
                this.user = data.value;
                return data.value
            }
        }
    }
})
