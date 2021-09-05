import { createTestDrawing } from '../../helpers/createTestDrawing.js';
import { createTestPath } from '../../helpers/createTestPath.js';
import { SVGVector2DDrawer } from '../../../modules/drawing/drawers/SVGVector2DDrawer.js';
import { Transparent } from '../../../modules/Transparent.js';
import { VectorDrawing } from '../../../modules/drawing/vector/VectorDrawing.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testPath(logger) {
	const drawer = new SVGVector2DDrawer(200, 200);
	const drawing = new VectorDrawing();
	drawing.addForegroundShape(createTestPath());
	drawing.drawAsSingleLayer(drawer);
}

function testTransparentScreenColor(logger) {
	const drawing = new VectorDrawing();
	drawing.setScreenColor(Transparent);
	const drawer = new SVGVector2DDrawer(200, 200);
	drawing.drawAsSingleLayer(drawer);
	const s = drawer.toString();
	const parser = new DOMParser();
	const doc = parser.parseFromString(s, "image/svg+xml");
	const svg = doc.querySelector('svg');
	if (svg.hasAttribute('style')) {
		const styleVal = svg.getAttribute('style');
		if (styleVal.indexOf('background-color') !== -1)
			logger('When the screenColor is transparent, svg background-color should not be set. It was set, though.  svg style attribute was set to ' + styleVal);
	}
}

function testWithTestDrawing(logger) {
	const drawing = createTestDrawing();
	const drawer = new SVGVector2DDrawer(200, 200);
	drawing.drawAsSingleLayer(drawer);
	const s = drawer.toString();
	if (s.indexOf('</svg>') === -1)
		logger('Expected to find </svg> but did not get it from toString().  toString() returned: ' + s);
	if (s.indexOf('circle') === -1)
		logger('Expected to find circle somewhere in the SVG content but did not find it');
	if (s.indexOf('line') === -1)
		logger('Expected to find line somewhere in the SVG content but did not find it');

	// parse SVG.
	const parser = new DOMParser();
	const doc = parser.parseFromString(s, "image/svg+xml");
	const lines = doc.querySelectorAll('line');
	const circles = doc.querySelectorAll('circle');
	const ellipses = doc.querySelectorAll('ellipse');
	const paths = doc.querySelectorAll('path');
	const gElements = doc.querySelectorAll('g');
	const svgElements = doc.querySelectorAll('svg');
	if (lines.length === 0)
		logger('At least 1 line expected but got ' + lines.length);
	if (circles.length === 0)
		logger('At least 1 circle expected but got ' + circles.length);
	if (ellipses.length === 0)
		logger('At least 1 ellipse expected but got ' + ellipses.length);
	if (svgElements.length !== 1)
		logger('Expected 1 svg element but got ' + svgElements.length);
	if (gElements.length !== 1)
		logger('Expected 1 g element but got ' + gElements.length);
	if (paths.length !== 2)
		logger('Expected 2 path but got ' + paths.length);
	lines.forEach(function(line) {
		const numAttrNames = ['x1', 'x2', 'y1', 'y2'];
		numAttrNames.forEach(function(numAttrName) {
			if (line.hasAttribute(numAttrName)) {
				const val = line.getAttribute(numAttrName);
				if (isNaN(val))
					logger('Number required for attribute ' + numAttrName + ' of line elements in SVG.  Instead got ' + val);
			}
		});
	});
	circles.forEach(function(circle) {
		const numAttrNames = ['cx', 'cy', 'r'];
		numAttrNames.forEach(function(numAttrName) {
			if (circle.hasAttribute(numAttrName)) {
				const val = circle.getAttribute(numAttrName);
				if (isNaN(val))
					logger('Number required for attribute ' + numAttrName + ' of circle elements in SVG.  Instead got ' + val);
			}
		});
	});
}

export function testSVGVector2DDrawer(logger) {
	wrapAndCall([
		testPath,
		testTransparentScreenColor,
		testWithTestDrawing
	], logger);
};