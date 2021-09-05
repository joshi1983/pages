import { getPaletteColours } from
'../../modules/components/image-formats/pcx/getPaletteColours.js';
import { PCX } from '../../modules/components/image-formats/PCX.js';
import { ready } from '../../modules/ready.js';
import { showColourPalette } from
'../helpers/showColourPalette.js';

let fileSelector;
let output;
let outputMeta;
let canvas;
let ctx;
let colours;
let zoomSelector;
let showPalette;

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
	const meta = PCX.getMeta(byteArray);
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
	canvas.setAttribute('width', box.width);
	canvas.setAttribute('height', box.height);
	ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
}

function clearCanvas() {
	refreshContext();
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, 5000, 5000);
}

async function drawPCXOnCanvas(arrayBuffer) {
	refreshContext();
	const imageBitmap = await PCX.arrayBufferToImageBitmap(arrayBuffer);
	const zoomScale = parseInt(zoomSelector.value);
	refreshMeta(new Uint8Array(arrayBuffer));
	ctx.drawImage(imageBitmap, 0, 0,
		imageBitmap.width * zoomScale,
		imageBitmap.height * zoomScale);
}

function refreshResults() {
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
		colours = getPaletteColours(byteArray);
		if (colours.length === 0) {
			showPalette.innerText = `No Colour Palette`;
			showPalette.disabled = true;
		}
		else {
			showPalette.innerText = `Show ${colours.length} Colour Palette`;
			showPalette.disabled = false;
		}
		clearCanvas();
		if (PCX.isPossibleMatch(byteArray)) {
			setOutputMessage(`Valid PCX selected`);
			drawPCXOnCanvas(arrayBuffer);
		}
		else {
			setOutputMessage(`The selected file is not a valid PCX.`);
		}
	};
	reader.readAsArrayBuffer(file);
}

function init() {
	fileSelector = document.getElementById('file-selector');
	output = document.getElementById('output-message');
	outputMeta = document.getElementById('output-meta');
	canvas = document.getElementById('display');
	zoomSelector = document.getElementById('zoom');
	showPalette = document.getElementById('showPalette');
	populateZooms();
	zoomSelector.addEventListener('change', refreshResults);
	fileSelector.addEventListener('change', refreshResults);
	showPalette.addEventListener('click', function() {
		if (!showPalette.disabled)
			showColourPalette(colours);
	});
	window.addEventListener('resize', refreshResults);
	refreshResults();
}

ready(init);