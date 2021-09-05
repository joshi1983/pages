import { scrapeProceduresFromParseTreeTokens } from './scrapeProceduresFromParseTreeTokens.js';

function proceduresArrayToMap(procedures) {
	const result = new Map();
	procedures.forEach(function(procedure) {
		result.set(procedure.name.toLowerCase(), procedure);
	});
	return result;
}

export function getProceduresMap(tree, extraProceduresMap) {
	if (extraProceduresMap !== undefined && !(extraProceduresMap instanceof Map))
		throw new Error('extraProceduresMap must either be undefined or a Map');

	const proceduresArray = scrapeProceduresFromParseTreeTokens(tree);
	if (extraProceduresMap instanceof Map) {
		for (const [key, value] of extraProceduresMap) {
			proceduresArray.push(value);
		}
	}
	return proceduresArrayToMap(proceduresArray);
}