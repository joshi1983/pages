import { decompress } from
'../../../../modules/components/image-formats/pcx/decompress.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testDecompress(logger) {
	const cases = [
		{'inArgs': [[1], 0, 1, 1, 1, 1],
		'out': [1, 0]},
		{'inArgs': [[0xc1, 1], 0, 1, 1, 1, 1],
		'out': [1, 0]},
		{'inArgs': [[0xc2, 1], 0, 1, 1, 1, 1],
		'out': [1, 1]},
		{'inArgs': [[0xc2, 1, 9], 0, 1, 1, 1, 1],
		'out': [1, 1]}
	];
	testInOutPairs(cases, decompress, logger);
};