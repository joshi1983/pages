import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testInsertText } from './testInsertText.js';
import { testInsertTextAfter } from './testInsertTextAfter.js';
import { testIsLiteralElement } from './testIsLiteralElement.js';
import { testMoveInnerTextWhileRemovingElement } from './testMoveInnerTextWhileRemovingElement.js';
import { testProcessPossibleToken } from './testProcessPossibleToken.js';
import { testPullInNeighbouringNonWhitespaces } from './testPullInNeighbouringNonWhitespaces.js';
import { testRemoveInnerText } from './testRemoveInnerText.js';
import { testScanInnerText } from './testScanInnerText.js';
import { testScanInnerTextManyCases } from './testScanInnerTextManyCases.js';

export function testInnerText(logger) {
	testInsertText(prefixWrapper('testInsertText', logger));
	testInsertTextAfter(prefixWrapper('testInsertTextAfter', logger));
	testIsLiteralElement(prefixWrapper('testIsLiteralElement', logger));
	testMoveInnerTextWhileRemovingElement(prefixWrapper('testMoveInnerTextWhileRemovingElement', logger));
	testProcessPossibleToken(prefixWrapper('testProcessPossibleToken', logger));
	testPullInNeighbouringNonWhitespaces(prefixWrapper('testPullInNeighbouringNonWhitespaces', logger));
	testRemoveInnerText(prefixWrapper('testRemoveInnerText', logger));
	testScanInnerText(prefixWrapper('testScanInnerText', logger));
	testScanInnerTextManyCases(prefixWrapper('testScanInnerTextManyCases', logger));
};