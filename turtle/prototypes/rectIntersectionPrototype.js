import { EventCoordinates } from
'../modules/components/EventCoordinates.js';
import { getRectIntersection } from
'../modules/drawing/vector/shapes/procedural-raster-rectangle/getRectIntersection.js';
import { isContainingPoint } from
'../modules/drawing/vector/shapes/procedural-raster-rectangle/isContainingPoint.js';
import { SimpleRect2D } from '../modules/drawing/vector/shapes/procedural-raster-rectangle/SimpleRect2D.js';
import { Vector2D } from
'../modules/drawing/vector/Vector2D.js';

const rect1 = new SimpleRect2D(0, 0, 100, 200, 0);
const rect2 = new SimpleRect2D(0, 0, 100, 200, 0);
let resultRect;
const rect1Color = 'red';
const resultRectColor = 'blue';
let lastPos = new Vector2D(0, 0);

function rotate(x, y, angleRadians) {
	const v = new Vector2D(x, y);
	return Vector2D.rotate(v, angleRadians);
}

function getPointColor() {
	if (isContainingPoint(rect1, lastPos))
		return 'black';
	else
		return 'lime';
}

function getRectColor(rect) {
	if (rect === rect1)
		return rect1Color;
	else if (rect === resultRect)
		return resultRectColor;
	else
		return '#000';
}

function drawRect(ctx, rect) {
	ctx.strokeStyle = getRectColor(rect);
	ctx.beginPath();
	ctx.moveTo(rect.x, rect.y);
	const points = [[rect.width, 0],
	[rect.width, rect.height],
	[0, rect.height]];
	points.forEach(function(p) {
		let v = rotate(p[0], p[1], rect.headingRadians);
		v = v.plus(new Vector2D(rect.x, rect.y));
		ctx.lineTo(v.coords[0], v.coords[1]);
	});
	ctx.closePath();
	ctx.stroke();
}

function getCanvas() {
	return document.getElementById('canvas');
}

function redraw() {
	resultRect = getRectIntersection(rect1, rect2);
	const canvas = getCanvas();
	const box = canvas.getBoundingClientRect();
	canvas.width = box.width;
	canvas.height = box.height;
	const ctx = canvas.getContext('2d');
	// clear the canvas.
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, 5000, 5000);

	drawRect(ctx, rect1);
	drawRect(ctx, rect2);
	if (resultRect !== undefined) {
		drawRect(ctx, resultRect);
		if (resultRect.sourcePoints !== undefined) {
			ctx.fillStyle = 'blue';
			const radius = 3;
			resultRect.sourcePoints.forEach(function(p) {
				ctx.beginPath();
				ctx.arc(p.getX(), p.getY(), radius, 0, 2 * Math.PI, false);
				ctx.fill();
			});
		}
	}
	ctx.fillStyle = getPointColor();
	ctx.beginPath();
	const radius = 4;
	ctx.arc(lastPos.getX(), lastPos.getY(), radius, 0, 2 * Math.PI, false);
	ctx.fill();
}

function updateRect1Color() {
	const h2 = document.querySelector('.inputs > div:first-child h2');
	h2.style.color = rect1Color;
}

function mouseMoved(event) {
	const element = getCanvas();
	lastPos = EventCoordinates.getRelativeXY(element, event);
	redraw();
}

function bindCanvas() {
	const canvas = getCanvas();
	canvas.addEventListener('mousemove', mouseMoved);
}

function init() {
	updateRect1Color();
	const bindings = [
		{'obj': rect1, 'x': 'rect1-x', 'y': 'rect1-y',
			'headingRadians': 'rect1-heading',
			'height': 'rect1-height',
			'width': 'rect1-width'},
		{'obj': rect2, 'x': 'rect2-x', 'y': 'rect2-y',
			'headingRadians': 'rect2-heading',
			'width': 'rect2-width',
			'height': 'rect2-height'}
	];
	bindings.forEach(function(info) {
		const obj = info.obj;
		for (let key in info) {
			if (key !== 'obj') {
				const e = document.getElementById(info[key]);
				if (e === null)
					throw new Error(`Unable to find element by id: ${info[key]}`);
				function valChanged() {
					let val = parseFloat(e.value);
					if (typeof val !== 'number')
						throw new Error(`val expected to be a number but got ${val} which has type of ${typeof val}`);
					if (key.endsWith('headingRadians'))
						val *= Math.PI / 180;
					obj[key] = val;
					redraw();
				}
				e.addEventListener('input', valChanged);
				valChanged();
			}
		}
	});
	bindCanvas();
}

document.addEventListener('DOMContentLoaded', init);