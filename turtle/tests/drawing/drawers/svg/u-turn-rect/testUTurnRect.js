import { testGetUTurnRectInfo } from './testGetUTurnRectInfo.js';
import { testIsUTurnRect } from './testIsUTurnRect.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testUTurnRect(logger) {
	wrapAndCall([
		testGetUTurnRectInfo,
		testIsUTurnRect,
	], logger);
};