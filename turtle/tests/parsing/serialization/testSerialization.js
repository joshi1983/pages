import { testConvertMessageObjectsToParseMessages } from './testConvertMessageObjectsToParseMessages.js';
import { testConvertObjectToParseTree } from './testConvertObjectToParseTree.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testSerialization(logger) {
	wrapAndCall([
		testConvertMessageObjectsToParseMessages,
		testConvertObjectToParseTree
	], logger);
};