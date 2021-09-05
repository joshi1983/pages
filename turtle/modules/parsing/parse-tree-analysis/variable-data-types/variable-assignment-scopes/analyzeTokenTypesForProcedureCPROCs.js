import { Command } from '../../../Command.js';
import { CProcType } from '../../../data-types/CProcType.js';
import { DataTypes } from '../../../data-types/DataTypes.js';
import { getOutputTypesForProcedureBasic } from '../getOutputTypesForProcedureBasic.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();
await DataTypes.asyncInit();

const interestingNames = new Set();
Command.getAllCommandsInfo().forEach(function(info) {
	if (info.args.some(arg => arg.types.startsWith('cproc')))
		interestingNames.add(info.primaryName);
});

function isOfInterest(cachedParseTree) {
	const procs = cachedParseTree.getProceduresMap();
	return function(token) {
		const name = token.val.toLowerCase();
		if (!procs.has(name))
			return false;
		const parent = token.parentNode;
		if (parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const info = Command.getCommandInfo(parent.val);
		if (info === undefined || !interestingNames.has(info.primaryName))
			return false;
		const types = Command.getParameterTypes(info, parent.children.indexOf(token));
		return types.startsWith('cproc');
	};
}

export function analyzeTokenTypesForProcedureCPROCs(cachedParseTree, result) {
	if (!(result instanceof Map))
		throw new Error(`result must be a Map but found ${result}`);

	const cprocs = cachedParseTree.getTokensByTypes([
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.LONG_STRING_LITERAL
	]).filter(isOfInterest(cachedParseTree));
	const procedures = cachedParseTree.getProceduresMap();
	cprocs.forEach(function(cprocToken) {
		const procedure = procedures.get(cprocToken.val.toLowerCase());
		const numArgs = procedure.parameters.length;
		//const returnTypes = ;
		const returnTypes = getOutputTypesForProcedureBasic(procedure, result);
		const cproc = new CProcType(numArgs, returnTypes.types);
		result.set(cprocToken, new DataTypes([cproc]));
	});
};