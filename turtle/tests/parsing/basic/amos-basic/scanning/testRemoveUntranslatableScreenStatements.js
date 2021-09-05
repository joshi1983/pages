import { processScanTokensTestCases } from './processScanTokensTestCases.js';
import { removeUntranslatableScreenStatements } from
'../../../../../modules/parsing/basic/amos-basic/scanning/removeUntranslatableScreenStatements.js';

export function testRemoveUntranslatableScreenStatements(logger) {
	const cases = [
		{'code': '', 'tokens': []},
		{'code': 'screen 2', 'tokens': ['screen', '2']},
		{'code': 'Screen Open 0,320,256,2,0', 'tokens': []},
		{'code': 'Screen 0', 'tokens': ['Screen', '0']},
		{'code': 'Screen Open 0,320,256,2,0 : Flash Off', 'tokens': ['Flash', 'Off']}
	];
	processScanTokensTestCases(cases, removeUntranslatableScreenStatements, logger);
};