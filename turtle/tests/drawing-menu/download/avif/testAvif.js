import { testIsAvifReadSupported } from './testIsAvifReadSupported.js';
import { testIsAvifWriteSupported } from './testIsAvifWriteSupported.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testAvif(logger) {
	wrapAndCall([
		testIsAvifReadSupported,
		testIsAvifWriteSupported
	], logger);
};