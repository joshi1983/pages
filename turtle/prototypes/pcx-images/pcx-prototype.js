import { PCX } from '../../modules/components/image-formats/PCX.js';

let fileSelector;
let output;
let canvas;
let ctx;

function setOutputMessage(msg) {
	output.innerText = msg;
}

function refreshContext() {
	const box = canvas.getBoundingClientRect();
	canvas.setAttribute('width', box.width);
	canvas.setAttribute('height', box.height);
	ctx = canvas.getContext('2d');
}

function clearCanvas() {
	refreshContext();
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, 5000, 5000);
}

async function drawPCXOnCanvas(arrayBuffer) {
	refreshContext();
	const imageBitmap = await PCX.arrayBufferToImageBitmap(arrayBuffer);
	ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);
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
		clearCanvas();
		if (PCX.isPossibleMatch(byteArray)) {
			setOutputMessage(`Valid PCX selected`);
			drawPCXOnCanvas(arrayBuffer);
			console.log(`file=${file}`);
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
	canvas = document.getElementById('display');
	fileSelector.addEventListener('change', refreshResults);
	window.addEventListener('resize', refreshResults);
	refreshResults();
}

init();