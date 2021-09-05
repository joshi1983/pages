import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testFixCode } from './testFixCode.js';
import { testFixers } from './fixers/testFixers.js';
import { testFixLogger } from './testFixLogger.js';

export function testCodeFixer(logger) {
	testFixCode(prefixWrapper('testFixCode', logger));
	testFixers(prefixWrapper('testFixers', logger));
	testFixLogger(prefixWrapper('testFixLogger', logger));
};