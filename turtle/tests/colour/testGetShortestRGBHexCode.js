import { Colour } from '../../modules/Colour.js';
import { AlphaColour } from '../../modules/AlphaColour.js';
import { getShortestRGBHexCode } from '../../modules/colour/getShortestRGBHexCode.js';
import { testInOutPairs } from '../helpers/testInOutPairs.js';

export function testGetShortestRGBHexCode(logger) {
	const cases = [
	{'in': new Colour('#fff'), 'out': '#FFF'},
	{'in': new Colour('#f00'), 'out': '#F00'},
	{'in': new Colour('#123'), 'out': '#123'},
	{'in': new AlphaColour('#1234'), 'out': '#234'},
	];
	testInOutPairs(cases, getShortestRGBHexCode, logger);
};