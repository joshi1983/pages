function init() {
	// remove every old service worker.
	navigator.serviceWorker.getRegistrations().then(function(registrations) {
		const url = 'image-service-worker.js';
		for(let registration of registrations) {
			if (registration.active.scriptURL.indexOf(url) !== -1) {
				console.log('unregistering a service worker with scriptURL: ' + registration.active.scriptURL);
				registration.unregister();
			}
		}
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register(url);
			console.log('registered ' + url);
		}
	});
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', init);
else
	init();