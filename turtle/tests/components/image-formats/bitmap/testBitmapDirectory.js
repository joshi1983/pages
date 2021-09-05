import { testDecodeBI_RLE4 } from
'./testDecodeBI_RLE4.js';
import { testDecodeBI_RLE8 } from
'./testDecodeBI_RLE8.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testBitmapDirectory(logger) {
	wrapAndCall([
		testDecodeBI_RLE4,
		testDecodeBI_RLE8
	], logger);
};