import type { IClimbingDiscipline, IUserPrivate as IMongoUser } from "~/server/models/User";

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
            disciplines: [] as IClimbingDiscipline[]
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
    getters: {
        address(state) {
            if(state.user.location.address && state.user.location.address.line1 && state.user.location.address.city && state.user.location.address.state && state.user.location.address.zip ) {
                return `${state.user.location.address.line1} ${state.user.location.address.line2 ? state.user.location.address.line2 : ''}, ${state.user.location.address.city} ${state.user.location.address.state} ${state.user.location.address.zip}`
            } else {
                return undefined
            }
        } 
    },
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