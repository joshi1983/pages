import { Transparent } from './../../../modules/Transparent.js';
import { TransparentType } from './../../../modules/parsing/data-types/TransparentType.js';

export function testTransparentType(logger) {
	const transparentType = new TransparentType();
	let result = transparentType.mayBeCompatibleWithValue(Transparent);
	if (result !== true)
		logger(`Expected true but got ${result} from mayBeCompatibleWithValue(Transparent)`);
};