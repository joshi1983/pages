import { compareCanvases } from '../../helpers/drawing/drawers/compareCanvases.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

function colourToCanvas(colour) {
	const result = document.createElement('canvas');
	const context = result.getContext('2d');
	context.fillStyle = colour;
	context.fillRect(0, 0, 1000, 1000);
	return result;
}

export function testCompareCanvases(logger) {
	const cases = [
	{'inArgs': [document.createElement('canvas'), document.createElement('canvas')],
	'out': 0},
	{'inArgs': [colourToCanvas('white'), colourToCanvas('black')],
	'out': 1},
	{'inArgs': [colourToCanvas('black'), colourToCanvas('white')],
	'out': 1},
	{'inArgs': [colourToCanvas('red'), colourToCanvas('black')],
	'out': 0.3333333333333333},
	{'inArgs': [colourToCanvas('blue'), colourToCanvas('black')],
	'out': 0.3333333333333333},
	];
	testInOutPairs(cases, compareCanvases, logger);
};