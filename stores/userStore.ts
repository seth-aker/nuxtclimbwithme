import type { IUser as IMongoUser } from "~/server/models/User";

export interface IUser extends Omit<IMongoUser, '_id' | 'communitiesJoined' | 'connections' | 'requestsSent' | 'requestsReceived' | 'blocked' | 'createdAt' | 'updatedAt'> {
    _id: string,
    communitiesJoined: string[],
    connections: string[],
    requestsSent: string[],
    requestsReceived: string[],
    blocked: string[],
    createdAt?: string | undefined,
    updatedAt?: string | undefined
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {
          _id: '',
          authId: '',
          email: '',
          location: {
            geoJSON: undefined,
            locatedAt: undefined,
            address: undefined,
          },
          climbingExperience: {
            disciplines: [] as { 
                name: 'Bouldering' | 'Sport' | 'Top Rope' | 'Trad' | 'Aid' | 'Ice' | 'Alpine',
                grade?: string,
                yearsExperience?: number,
                certified?: boolean
              }[],
          },
          availability: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          },
          preferences: {
            colorTheme: 'system',
            openToClimbingTypes: undefined,
            searchRadius: undefined,
          },
          communitiesJoined: [],
          connections: [],
          requestsSent: [],
          requestsReceived: [],
          blocked: [],
          registrationCompleted: false

        } as IUser,
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
                this.$patch({user: data.value})
            }
        },
        async updateUser(payload: Partial<IUser>) {
            this.error = null;
            
            const response = await $fetch(`/api/users/${this.$state.user._id}`, {method: "PUT", body: payload});
            if(!response) {
                this.error = "There was an error updating the user."
            } else {
                this.$patch({user: payload})
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