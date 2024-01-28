function delay(timeMilliseconds) {
	return new Promise((resolve) => setTimeout(resolve, timeMilliseconds));
}

function dataURItoBlob() {
  // create a view into the buffer
  var ia = new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,0,0,0,9,112,72,89,115,0,0,46,35,0,0,46,35,1,120,165,63,118,0,0,0,7,116,73,77,69,7,231,6,20,2,41,22,36,184,74,38,0,0,0,25,116,69,88,116,67,111,109,109,101,110,116,0,67,114,101,97,116,101,100,32,119,105,116,104,32,71,73,77,80,87,129,14,23,0,0,0,12,73,68,65,84,8,215,99,96,96,96,0,0,0,4,0,1,39,52,39,10,0,0,0,0,73,69,78,68,174,66,96,130]);
  // write the bytes of the string to an ArrayBuffer
  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ia], {type: 'image/png'});
}

const testImageSubstring = 'testImage.png';
const imageData = dataURItoBlob();

self.addEventListener('install', () => {
  console.log('install happening in service worker')
})

self.addEventListener('activate', () => {
  console.log('Serive worker now active')
})

self.addEventListener('fetch', event => {
  if (event.request.url.indexOf(testImageSubstring) !== -1) {
	console.log(`handling ${testImageSubstring} request`);
	event.respondWith(delay(2000).then(() => new Response(imageData, {
		"status": 200,
		"headers": {
			"Content-Type": "image/png"
		}
	})
	));
  }
});