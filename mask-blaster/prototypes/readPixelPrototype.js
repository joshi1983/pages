/*
This is for a prototype that interactively tests
the readPixel function and module.
*/
import { readPixel } from
'../modules/screens/playing/readPixel.js';
import { ready } from
'../modules/ready.js';

function init() {
	const colorDiv = document.getElementById('color');
	const img = document.querySelector('img');
	img.addEventListener('mousemove', function(event) {
		const x = event.clientX;
		const y = event.clientY;
		const xRatio = (x / img.width) - 0.5;
		const yRatio = (y - img.height / 2) / img.width;
		const c = readPixel(img, xRatio, yRatio);
		colorDiv.style.backgroundColor = 'rgba(' + c.join(',') + ')';
	});
}

ready(init);