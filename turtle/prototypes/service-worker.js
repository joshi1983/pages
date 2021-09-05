function delay(timeMilliseconds) {
	return new Promise((resolve) => setTimeout(resolve, timeMilliseconds));
}

const helloWorld = 'helloWorld.html';

self.addEventListener('fetch', event => {
  console.log('handling request to ' + event.request.url);
  if (event.request.url.indexOf(helloWorld) !== -1) {
	console.log('handling helloWorld.html request');
	event.respondWith(delay(2000).then(() => new Response("hello world " + Math.random() + '...',{status: 200})));
  }
});