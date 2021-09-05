import { asyncDownscale } from
'../../modules/drawing/drawers/canvas/asyncDownscale.js';
import { ready } from '../../modules/ready.js';

async function downScaleToOutputCanvas() {
	const inCanvas = getInputCanvas();
	const outCanvas = document.getElementById('output-canvas');
	const scaleFactorSelect = getScaleFactorSelect();
	const scaleFactor = parseInt(scaleFactorSelect.value);
	const imageData = await asyncDownscale(scaleFactor, inCanvas);
	const ctx = outCanvas.getContext('2d');
	ctx.putImageData(imageData, 0, 0);
}

function getInputCanvas() {
	return document.getElementById('input-canvas');
}

function getScaleFactorSelect() {
	return document.getElementById('scale-factor');
}

function drawOnInputCanvas() {
	const inCanvas = getInputCanvas();
	inCanvas.setAttribute('width', 251);
	inCanvas.setAttribute('height', 151);
	const ctx = inCanvas.getContext('2d');
	ctx.fillStyle = '#2080f0';
	ctx.rect(0,0, 300,300);
	ctx.fill();
	ctx.lineWidth = 3;
	ctx.strokeStyle = '#123';
	ctx.beginPath();
	ctx.moveTo(10, 10);
	ctx.lineTo(50, 50);
	ctx.lineTo(30, 10);
	ctx.stroke();
	ctx.closePath();

	ctx.strokeStyle = '#0ff';
	ctx.beginPath();
	ctx.moveTo(100, 100);
	ctx.lineTo(250, 250);
	ctx.lineTo(0, 100);
	ctx.stroke();
	ctx.closePath();
	
	ctx.fillStyle = '#f00';
	const centerX = 190;
	const centerY = 125;
	const radius = 30;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.closePath();
	downScaleToOutputCanvas(inCanvas);
}

function bindScaleFactor() {
	const scaleFactorSelect = getScaleFactorSelect();
	scaleFactorSelect.addEventListener('change', downScaleToOutputCanvas);
}

function init() {
	drawOnInputCanvas();
	bindScaleFactor();
}

ready(init);