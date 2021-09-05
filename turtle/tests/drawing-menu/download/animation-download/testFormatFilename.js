import { formatFilename } from '../../../../modules/drawing-menu/download/animation-download/formatFilename.js';

export function testFormatFilename(logger) {
	const result = formatFilename('animation_', 15, '.jpg');
	const expected = 'animation_00000015.jpg';
	if (result !== expected)
		logger(`Expected "${expected}" but got "${result}"`);
};