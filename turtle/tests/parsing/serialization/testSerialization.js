import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testConvertMessageObjectsToParseMessages } from './testConvertMessageObjectsToParseMessages.js';
import { testConvertObjectToParseTree } from './testConvertObjectToParseTree.js';

export function testSerialization(logger) {
	testConvertMessageObjectsToParseMessages(prefixWrapper('testConvertMessageObjectsToParseMessages', logger));
	testConvertObjectToParseTree(prefixWrapper('testConvertObjectToParseTree', logger));
};