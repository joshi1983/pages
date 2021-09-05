import { filterProceduresMatchingQuery } from '../../../modules/debugging/intermediate-code-explorer/filterProceduresMatchingQuery.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../modules/parsing/Procedure.js';

export function testFilterProceduresFromQuery(logger) {
	const procs = new Map();
	let results = filterProceduresMatchingQuery('', procs);
	if (!(results instanceof Array))
		logger('filterProceduresMatchingQuery expected to return an Array but got ' + results);
	else {
		if (results.length !== 0)
			logger('Expected length of 0 but got ' + results.length);
		const procName = 'dosomething';
		const nameToken = new ParseTreeToken(procName, null, 0, 0, ParseTreeTokenType.LEAF);
		procs.set(procName, new Procedure(procName, [], nameToken));
		results = filterProceduresMatchingQuery('', procs);
		if (results.length !== 1)
			logger('When looking for empty string, expected length of 1 but got ' + results.length);
		else {
			if (!(results[0] instanceof Procedure))
				logger('Expected search result to be a Procedure but got ' + results[0]);
		}
		results = filterProceduresMatchingQuery(procName, procs);
		if (results.length !== 1)
			logger('When looking for ' + procName + ', expected length of 1 but got ' + results.length);
	}
};