import { noop } from '../../helpers/noop.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../modules/parsing/Procedure.js';
import { procedureToSearchItem } from '../../../modules/debugging/intermediate-code-explorer/procedureToSearchItem.js';

function testForGlobalInstructions(logger) {
	const e = procedureToSearchItem(null, noop);
	if (!(e instanceof Element))
		logger('procedureToSearchItem(null) expected to return an Element but got ' + e);
}

function testWithActualProcedure(logger) {
	const procName = 'dosomething';
	const nameToken = new ParseTreeToken(procName, null, 0, 0, ParseTreeTokenType.LEAF);
	const proc = new Procedure(procName, ['x', 'y'], nameToken);
	const e = procedureToSearchItem(proc, noop);
	if (!(e instanceof Element))
		logger('procedureToSearchItem expected to return an Element but got ' + e);
	else {
		if (e.textContent.indexOf(procName) === -1)
			logger('Expected to find ' + procName + ' in textContent of ' + e.textContent);
		if (e.textContent.indexOf('x') === -1)
			logger('Expected to find x in textContent of ' + e.textContent);
		if (e.textContent.indexOf('y') === -1)
			logger('Expected to find y in textContent of ' + e.textContent);
	}
}

export function testProcedureToSearchItem(logger) {
	testForGlobalInstructions(logger);
	testWithActualProcedure(logger);
};