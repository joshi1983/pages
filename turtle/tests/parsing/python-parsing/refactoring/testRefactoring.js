import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testFunctionRename } from './testFunctionRename.js';
import { testGetWebLogoSafeFunctionNameFrom } from './testGetWebLogoSafeFunctionNameFrom.js';
import { testRefactor } from './testRefactor.js';

export function testRefactoring(logger) {
	testFunctionRename(prefixWrapper('testFunctionRename', logger));
	testGetWebLogoSafeFunctionNameFrom(prefixWrapper('testGetWebLogoSafeFunctionNameFrom', logger));
	testRefactor(prefixWrapper('testRefactor', logger));
};