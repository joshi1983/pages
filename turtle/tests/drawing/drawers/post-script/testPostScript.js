import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testPageSize } from './testPageSize.js';
import { testPageSizesJSON } from './testPageSizesJSON.js';
import { testToPostScriptLineJoin } from './testToPostScriptLineJoin.js';
import { testUpdateStrokeStyle } from './testUpdateStrokeStyle.js';

export function testPostScript(logger) {
	testPageSize(prefixWrapper('testPageSize', logger));
	testPageSizesJSON(prefixWrapper('testPageSizesJSON', logger));
	testToPostScriptLineJoin(prefixWrapper('testToPostScriptLineJoin', logger));
	testUpdateStrokeStyle(prefixWrapper('testUpdateStrokeStyle', logger));
};