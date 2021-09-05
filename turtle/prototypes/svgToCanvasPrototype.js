import { compareCanvases } from '../tests/helpers/drawing/drawers/compareCanvases.js';
import { createDrawingFromCode } from '../tests/helpers/createDrawingFromCode.js';
import { createTestG } from '../tests/helpers/createTestG.js';
import { drawingToCanvas } from '../tests/helpers/drawing/drawers/drawingToCanvas.js';
import { drawingToSVGText } from '../modules/drawing-menu/download/drawing-download/drawingToSVGText.js';
import { optimizeDrawing } from '../modules/drawing/vector/drawing_optimization/optimizeDrawing.js';
import { ParseLogger } from '../modules/parsing/loggers/ParseLogger.js';
import { svgToCanvas } from '../tests/helpers/drawing/drawers/svgToCanvas.js';
import { SVGTransformer } from '../modules/components/svg-drawing-viewer/SVGTransformer.js';

const codeDrawingMap = new Map();
const width = 200;
const height = 200;
let textarea;

function updateTextarea() {
	if (textarea === undefined)
		textarea = document.querySelector('.editor > textarea');
}

function getCode() {
	updateTextarea();
	return textarea.value.trim();
}

function computeDrawing() {
	const code = getCode();
	const drawing = codeDrawingMap.get(code);
	if (drawing === undefined) {
		const d = createDrawingFromCode(code, console.log);
		if (d !== undefined)
			codeDrawingMap.set(code, d);
		return d;
	}
	return drawing;
}

async function addSVGCanvas(svg) {
	const container = document.querySelector('#svg-canvas-container > div');
	container.innerHTML = '';
	const canvas = await svgToCanvas(svg, width, height);
	container.appendChild(canvas);
}

function updateCanvas(drawing) {
	const canvas = drawingToCanvas(drawing, width, height);
	const container = document.querySelector('#canvas-container > div');
	container.innerText = '';
	container.appendChild(canvas);
}

function updateDifferenceRatio() {
	const canvas1 = document.querySelector('#svg-canvas-container canvas');
	const canvas2 = document.querySelector('#canvas-container canvas');
	const ratio = compareCanvases(canvas1, canvas2, 1);
	const output = document.getElementById('difference-ratio');
	output.innerText = ratio.toFixed(5);
}

function getOptimizeDrawingCheckbox() {
	return document.getElementById('optimize-drawing');
}

function setSVGText(s) {
	const div = document.getElementById('svg-text');
	div.innerText = s;
}

function shouldOptimizeDrawing() {
	const checkbox = getOptimizeDrawingCheckbox();
	return checkbox.checked;
}

async function refreshDrawingsFromCode() {
	const drawing = computeDrawing();
	if (drawing !== undefined) {
		const g = createTestG('g');
		if (shouldOptimizeDrawing())
			optimizeDrawing(drawing);
		const transformer = new SVGTransformer(g, width, height);
		const svgText = drawingToSVGText(drawing, transformer);
		setSVGText(svgText);
		await addSVGCanvas(svgText);
		updateCanvas(drawing);
		updateDifferenceRatio();
	}
}

function bindTextarea() {
	updateTextarea();
	textarea.addEventListener('input', refreshDrawingsFromCode);
	refreshDrawingsFromCode();
}

const replacements = [
	['NEW_LINE', '\n'],
	['TAB', '\t'],
	['\\n', '\n'],
	['\\t', '\t'],
	['\\r', '\r'],
];
function convertEscaped(s) {
	replacements.forEach(function(pair) {
		s = s.replaceAll(pair[0], pair[1]);
	});
	return s;
}

function convertEscapedText() {
	updateTextarea();
	textarea.value = convertEscaped(textarea.value);
	refreshDrawingsFromCode();
}

function bindEscaped() {
	const button = document.getElementById('convert-escaped-text');
	button.addEventListener('click', convertEscapedText);
}

bindTextarea();
bindEscaped();
getOptimizeDrawingCheckbox().addEventListener('click', refreshDrawingsFromCode);