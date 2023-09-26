<script setup lang="ts">
	import { inject, ref } from 'vue';
	import RideGateway from '../infra/gateway/RideGateway';

	const ride = ref({ }) as any;
	const rideId = ref("3ecb6d07-d99c-4838-8458-4169e2b25ad6");
	const error = ref("");
	const rideGateway = inject("rideGateway") as RideGateway;

	async function submit () {
		try {
			const output = await rideGateway.getRide(rideId.value);
			ride.value = output;
		} catch (e: any) {
			error.value = e.message;
		}
	}

</script>

<template>
	<div>
		<h2 class="get-ride-title">Get Ride</h2>
		<input class="get-ride-ride-id" type="text" v-model="rideId"/>
		<button class="get-ride-submit" @click="submit()">Submit</button>
		<div v-if="ride.status">
			<span class="get-ride-passenger-id">{{ ride.passengerId }}</span>
			<span class="get-ride-passenger-name">{{ ride.passenger.name }}</span>
			<span class="get-ride-passenger-email">{{ ride.passenger.email }}</span>
			<span class="get-ride-passenger-cpf">{{ ride.passenger.cpf }}</span>
			<span class="get-ride-status">{{ ride.status }}</span>
		</div>
		
	</div>
</template>