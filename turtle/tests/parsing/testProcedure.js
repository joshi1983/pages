import { DeepEquality } from '../../modules/DeepEquality.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { noop } from '../helpers/noop.js';
import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js';
import { Procedure } from '../../modules/parsing/Procedure.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
import { tokenToProcedure } from '../../modules/parsing/parse-tree-analysis/tokenToProcedure.js';

export function testProcedure(logger) {
	const code = 'to here :x :y :Z\nprint :x\nprint :Y\nend fd 100';
	const parseLogger = new TestParseLogger(noop, code);
	const treeRoot = LogoParser.getParseTree(code, parseLogger);
	const procStartToken = ParseTreeToken.flatten(treeRoot).filter(t => t.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)[0];
	const proc = tokenToProcedure(procStartToken);
	if (proc.parameters.length !== 3)
		logger('Expected 3 parameters but got ' + proc.parameters.length);
	else {
		const expected = ['x', 'y', 'z'];
		if (!DeepEquality.equals(expected, proc.parameters))
			logger('Expected parameters to be ' + JSON.stringify(expected) + ' but got ' + JSON.stringify(proc.parameters));
	}
	if (Procedure.isNameToken(proc.nameToken) !== true)
		logger('Expected isNameToken to return true but got ' + Procedure.isNameToken(proc.nameToken));
	if (Procedure.isNameToken(treeRoot) !== false)
		logger('Expected isNameToken to return false for treeRoot but got ' + Procedure.isNameToken(proc.nameToken));

	const instructionsToken = proc.getInstructionListToken();
	if (instructionsToken.val !== null)
		logger('Expected instructions token to have val of null but got ' + instructionsToken.val);
	const endToken = proc.getEndToken();
	if (Procedure.isNameToken(endToken) !== false)
		logger('Expected isNameToken to return false for endToken but got ' + Procedure.isNameToken(proc.nameToken));
	const expected = ParseTreeTokenType.PROCEDURE_END_KEYWORD;
	if (endToken.type !== expected)
		logger('End token expected to have type ' + ParseTreeTokenType.getNameFor(expected) + ' but got ' + ParseTreeTokenType.getNameFor(endToken.type));
	if (endToken.val !== 'end')
		logger('End token expected to have val "end" but got ' + endToken.val);
	
	const xParamToken = proc.getTokenForParameter(0);
	if (xParamToken.val !== 'x')
		logger('Expected xParamToken.val to be x but got ' + xParamToken.val);

	if (Procedure.isParameterToken(xParamToken) !== true)
		logger('Expected to find xParamToken to be a parameter token but isParameterToken returned ' + Procedure.isParameterToken(xParamToken));

	const yParamToken = proc.getTokenForParameter(1);
	if (yParamToken.val !== 'y')
		logger('Expected yParamToken.val to be y but got ' + yParamToken.val);
	const zParamToken = proc.getTokenForParameter(2);
	if (zParamToken.val !== 'Z')
		logger('Expected zParamToken.val to be Z but got ' + zParamToken.val);

	if (Procedure.isParameterToken(zParamToken) !== true)
		logger('Expected to find zParamToken to be a parameter token but isParameterToken returned ' + Procedure.isParameterToken(zParamToken));
	if (Procedure.isParameterToken(proc.nameToken) !== false)
		logger('Expected isParameterToken to return false for nameToken but got ' + Procedure.isParameterToken(proc.nameToken));
	if (Procedure.isParameterToken(endToken) !== false)
		logger('Expected isParameterToken to return false for endToken but got ' + Procedure.isParameterToken(endToken));
	if (Procedure.isParameterToken(treeRoot) !== false)
		logger('Expected isParameterToken to return false for treeRoot but got ' + Procedure.isParameterToken(treeRoot));

	const reversedParameters = proc.getReversedParameters();
	if (reversedParameters instanceof Array) {
		if (reversedParameters.length !== 3)
			logger('Expected to get 3 reversed parameters but got ' + reversedParameters.length);
		else if (reversedParameters[0] !== 'z')
			logger('Expected first parameter of reversed parameters to be z but got ' + reversedParameters[0]);
	}
	else
		logger('reversed parameters expected to be an Array but is not');

	const firstPrintToken = instructionsToken.getAllDescendentsAsArray().filter(t => t.val === 'print')[0];
	if (proc.isContainingToken(firstPrintToken) !== true)
		logger(`isContaining expected to return true for the print token but got ${proc.isContainingToken(firstPrintToken)}`);
};