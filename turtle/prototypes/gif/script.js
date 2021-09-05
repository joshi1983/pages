let display;
let frameIndex;
let sup1;

function refreshDisplay() {
	const box = display.getBoundingClientRect();
	display.setAttribute('width', Math.round(box.width));
	display.setAttribute('height', Math.round(box.height));
	const ctx = display.getContext('2d');
	const index = parseInt(frameIndex.value);
	sup1.move_to(index);
	const internalCanvas = sup1.get_canvas();
	ctx.drawImage(internalCanvas, 0, 0);
}

function init() {
	display = document.getElementById('display');
	frameIndex = document.getElementById('frameIndex');
	frameIndex.addEventListener('input', refreshDisplay);
	const img = document.createElement('img');
	img.src = './lib/libgif-js/example_gifs/rub_test.gif';
	sup1 = new SuperGif({ gif: img } );
	sup1.load(function() {
		refreshDisplay();
		const count = document.getElementById('frameCount');
		const len = sup1.get_length();
		count.innerText = '' + len;
		frameIndex.setAttribute('max', len - 1);
	});
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', init);
else
	init();