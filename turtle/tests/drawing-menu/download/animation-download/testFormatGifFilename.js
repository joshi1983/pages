import { formatGifFilename } from '../../../../modules/drawing-menu/download/animation-download/formatGifFilename.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testFormatGifFilename(logger) {
	const cases = [
		{'in': 'a', 'out': 'a.gif'},
		{'in': 'a.gif', 'out': 'a.gif'},
		{'in': 'a.jpg', 'out': 'a.gif'},
		{'in': 'a.png', 'out': 'a.gif'},
		{'in': 'a.jpeg', 'out': 'a.gif'},
		{'in': 'a.ready', 'out': 'a.ready.gif'},
	];
	testInOutPairs(cases, formatGifFilename, logger);
};