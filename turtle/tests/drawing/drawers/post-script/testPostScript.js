import { testPageSize } from './testPageSize.js';
import { testPageSizesJSON } from './testPageSizesJSON.js';
import { testToPostScriptLineJoin } from './testToPostScriptLineJoin.js';
import { testUpdateStrokeStyle } from './testUpdateStrokeStyle.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPostScript(logger) {
	wrapAndCall([
		testPageSize,
		testPageSizesJSON,
		testToPostScriptLineJoin,
		testUpdateStrokeStyle
	], logger);
};