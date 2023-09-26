import GeolocationGateway from "./GeolocationGateway";

export default class GeolocationGatewayBrowser implements GeolocationGateway {
	
	getGeolocation(): Promise<any> {
		return new Promise((resolve) => {
			navigator.geolocation.getCurrentPosition(function (position: any) {
				resolve({ lat: position.coords.latitude, long:  position.coords.longitude });
			});
		});
	}

}
