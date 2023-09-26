<script setup lang="ts">
	import { inject, onMounted, ref } from 'vue';
	import RideGateway from '../infra/gateway/RideGateway';
	import GeolocationGateway from '../infra/gateway/GeolocationGateway';

	const ride: any = ref({
		passengerId: "5e50500d-dc56-4099-8c28-cef2b5ce5fdb",
		from: {
			lat: 0,
			long: 0
		},
		to: {
			lat: 0,
			long: 0
		}
	});
	const rideId = ref("");
	const error = ref("");
	const rideGateway = inject("rideGateway") as RideGateway;
	const geolocationGateway = inject("geolocationGateway") as GeolocationGateway;

	async function submit () {
		try {
			const output = await rideGateway.requestRide(ride.value);
			rideId.value = output.rideId;
		} catch (e: any) {
			error.value = e.message;
		}
	}

	onMounted(async () => {
		const coords = await geolocationGateway.getGeolocation();
		ride.value.from.lat = coords.lat;
		ride.value.from.long = coords.long;
	});
</script>

<template>
	<div>
		<h2 class="request-ride-title">Request Ride</h2>
		<input class="request-ride-passenger-id" type="text" v-model="ride.passengerId"/>
		<input class="request-ride-from-lat" type="text" v-model="ride.from.lat"/>
		<input class="request-ride-from-long" type="text" v-model="ride.from.long"/>
		<input class="request-ride-to-lat" type="text" v-model="ride.to.lat"/>
		<input class="request-ride-to-long" type="text" v-model="ride.to.long"/>
		<button class="request-ride-submit" @click="submit()">Submit</button>
		<span v-if="rideId" class="request-ride-ride-id">{{ rideId }}</span>
		<span v-if="error" class="request-ride-error">{{ error }}</span>
	</div>
</template>