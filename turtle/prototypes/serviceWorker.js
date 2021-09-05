function init() {
	// remove every old service worker.
	navigator.serviceWorker.getRegistrations().then(function(registrations) {
		const url = 'service-worker.js';
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

	document.querySelector('#show').addEventListener('click', async () => {
	  const div = document.getElementById('fetch-result');
	  div.innerText = '';
	  const response = await fetch('./helloWorld.html');
	  const text = await response.text();
	  console.log(`text = ${text}`);
	  div.innerText = text;
	});
}

document.addEventListener('DOMContentLoaded', init);