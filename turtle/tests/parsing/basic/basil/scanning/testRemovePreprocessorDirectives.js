import { processScanTokensTestCases } from './processScanTokensTestCases.js';
import { removePreprocessorDirectives } from
'../../../../../modules/parsing/basic/basil/scanning/removePreprocessorDirectives.js';

/*
We remove the ptr statements because they seem to always be declaring variables used in
untranslatable sections of code like Windows message blocks.
*/
export function testRemovePreprocessorDirectives(logger) {
	const cases = [
		//{'code': '', 'tokens': []},
		{'code': `#USE DB_POSTGRES, ORM
DIM `, 'tokens': ['DIM']},/*
		{'code': '#USE DB_POSTGRES, ORM', 'tokens': []},
		{'code': '#USE DB_POSTGRES \' a comment', 'tokens': ['\' a comment']},
		{'code': '#USE DB_POSTGRES REM a comment', 'tokens': ['REM a comment']}*/
	];
	processScanTokensTestCases(cases, removePreprocessorDirectives, logger);
};