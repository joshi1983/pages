import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testDtTokenToParseTreeTokenType } from './testDtTokenToParseTreeTokenType.js';
import { testGetSingleLineCommentsFromCode } from './testGetSingleLineCommentsFromCode.js';
import { testIndexToRowColIndex } from './testIndexToRowColIndex.js';
import { testIsPythonIdentifier } from './testIsPythonIdentifier.js';
import { testIsPythonOperator } from './testIsPythonOperator.js';
import { testSanitizePythonCode } from './testSanitizePythonCode.js';

export function testParseTreeConversion(logger) {
	testDtTokenToParseTreeTokenType(prefixWrapper('testDtTokenToParseTreeTokenType', logger));
	testGetSingleLineCommentsFromCode(prefixWrapper('testGetSingleLineCommentsFromCode', logger));
	testIndexToRowColIndex(prefixWrapper('testIndexToRowColIndex', logger));
	testIsPythonIdentifier(prefixWrapper('testIsPythonIdentifier', logger));
	testIsPythonOperator(prefixWrapper('testIsPythonOperator', logger));
	testSanitizePythonCode(prefixWrapper('testSanitizePythonCode', logger));
};