import { PPM } from '../../modules/components/image-formats/PPM.js';

let fileSelector;
let output;
let outputMeta;
let canvas;
let ctx;
let zoomSelector;

function populateZooms() {
	const zooms = [1, 2, 4, 8, 16, 32, 64];
	for (const zoom of zooms) {
		const option = document.createElement('option');
		option.innerText = `Scale ${zoom}`;
		option.value = '' + zoom;
		zoomSelector.appendChild(option);
	}
}

function setOutputMessage(msg) {
	output.innerText = msg;
}

function refreshMeta(byteArray) {
	const meta = PPM.getMeta(byteArray);
	outputMeta.innerHTML = '';
	for (const key in meta) {
		const line = document.createElement('div');
		const keySpan = document.createElement('span');
		keySpan.classList.add('key');
		keySpan.innerText = key;
		line.appendChild(keySpan);
		const value = meta[key];
		const valueSpan = document.createElement('span');
		valueSpan.innerText = '' + value;
		line.appendChild(valueSpan);
		outputMeta.appendChild(line);
	}
	refreshContext();
}

function refreshContext() {
	const box = canvas.getBoundingClientRect();
	canvas.setAttribute('width', '' + Math.ceil(box.width));
	canvas.setAttribute('height', '' + Math.ceil(box.height));
	ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
}

function clearCanvas() {
	refreshContext();
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, 5000, 5000);
}

async function drawPPMOnCanvas(arrayBuffer) {
	refreshContext();
	const imageBitmap = await PPM.arrayBufferToImageBitmap(arrayBuffer);
	const zoomScale = parseInt(zoomSelector.value);
	refreshMeta(new Uint8Array(arrayBuffer));
	ctx.drawImage(imageBitmap, 0, 0,
		imageBitmap.width * zoomScale,
		imageBitmap.height * zoomScale);
}

function refreshResults() {
	refreshContext();
	const file = fileSelector.files[0];
	if (file === undefined) {
		setOutputMessage(`No file selected`);
		return;
	}
	setOutputMessage('processing...');
	const reader = new FileReader();
	reader.onload = function() {
		const arrayBuffer = this.result;
		const byteArray = new Uint8Array(arrayBuffer);
		clearCanvas();
		if (PPM.isPossibleMatch(byteArray)) {
			const meta = PPM.getMeta(byteArray);
			setOutputMessage(`Valid PPM/PGM/PBM selected`);
			drawPPMOnCanvas(arrayBuffer);
			refreshMeta(byteArray);
		}
		else {
			setOutputMessage(`The selected file is not a valid PPM.`);
		}
	};
	reader.readAsArrayBuffer(file);
}

function init() {
	fileSelector = document.getElementById('file-selector');
	output = document.getElementById('output-message');
	outputMeta = document.getElementById('output-meta');
	canvas = document.getElementById('display');
	refreshContext();
	zoomSelector = document.getElementById('zoom');
	populateZooms();
	zoomSelector.addEventListener('change', refreshResults);
	fileSelector.addEventListener('change', refreshResults);
	window.addEventListener('resize', refreshResults);
	refreshResults();
}

init();