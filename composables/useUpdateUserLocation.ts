import { useGeolocation } from '@vueuse/core';
import { watch } from 'vue';
import { useUserStore } from '~/stores/userStore';

export function useUpdateUserLocation() {
  const { coords, locatedAt, error } = useGeolocation();
  const userStore = useUserStore();

  watch(locatedAt, async () => {
    if (error.value) {
      userStore.user.location.geoJSON = undefined;
    } else if (coords.value.latitude && coords.value.longitude) {
      if (!userStore.user.location) {
        userStore.user.location = { geoJSON: undefined, locatedAt: locatedAt.value, address: undefined };
      }
      userStore.user.location.geoJSON = { type: "Point", coordinates: [coords.value.longitude, coords.value.latitude] };
      userStore.user.location.locatedAt = locatedAt.value;
    }
    await userStore.updateUser({ location: userStore.user.location });
  }, { once: true });
}
