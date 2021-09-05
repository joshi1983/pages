import { createTestDrawing } from '../../../helpers/createTestDrawing.js';
import { createTestG } from './createTestG.js';
import { drawingToSVGText } from '../../../../modules/drawing-menu/download/drawing-download/drawingToSVGText.js';
import { SVGTransformer } from '../../../../modules/components/svg-drawing-viewer/SVGTransformer.js';

function scrapeValueFromTransform(substring, s, logger) {
	const index = s.indexOf(substring);
	if (index === -1)
		logger('Expected to find ' + substring + ' in ' + s);
	else {
		s = s.substring(index + substring.length);
		const bracketIndex = s.indexOf('(');
		if (bracketIndex === -1)
			logger('Expected to find ( after ' + substring + ' in: ' + s);
		else {
			s = s.substring(bracketIndex + 1);
			const closingBracketIndex = s.indexOf(')');
			if (closingBracketIndex === -1)
				logger('Expected to find closing bracket in ' + s);
			else {
				return s.substring(0, closingBracketIndex).replace(/\s*,\s*/g, ',');
			}
		}
	}
}

export function testDrawingToSVGText(logger) {
	const g = createTestG();
	const transformer = new SVGTransformer(g, 1920, 1080);
	transformer.setScale(2);
	const drawing = createTestDrawing();
	let s = drawingToSVGText(drawing, transformer);
	const parser = new DOMParser();
	const doc = parser.parseFromString(s, "image/svg+xml");
	let svg = doc.querySelector('svg');
	if (svg === null)
		logger('svg Element not found');
	else {
		const w = svg.getAttribute('width');
		const h = svg.getAttribute('height');
		if (w !== '1920')
			logger('width expected to be 1920 but got ' + w);
		if (h !== '1080')
			logger('height expected to be 1080 but got ' + h);
		const g = doc.querySelector('g');
		if (g === null)
			logger('drawingToSVGText should return SVG markup defining a g element but none was found.');
		else {
			const transform = g.getAttribute('transform');
			const scale = scrapeValueFromTransform('scale', transform, logger);
			if (scale !== '2,-2')
				logger('Expected to get scale of 2,-2 but got ' + scale);
		}
	}
};