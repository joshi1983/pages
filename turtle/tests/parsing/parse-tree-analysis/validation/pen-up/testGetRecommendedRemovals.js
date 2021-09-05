import { Command } from '../../../../../modules/parsing/Command.js';
import { primaryNamesOfInterest, getRecommendedRemovals } from
'../../../../../modules/parsing/parse-tree-analysis/validation/pen-up/getRecommendedRemovals.js';
import { getDescendentsOfType } from
'../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from '../../../../../modules/parsing/LogoParser.js';
import { noop } from '../../../../../modules/noop.js';
import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../../helpers/TestParseLogger.js';
await Command.asyncInit();

function validatePrimaryNamesOfInterest(logger) {
	Array.from(primaryNamesOfInterest).forEach(function(primaryName) {
		const info = Command.getCommandInfo(primaryName);
		if (info === undefined)
			logger(`No command found named ${primaryName}`);
		else if (info.primaryName !== primaryName)
			logger(`A command named ${info.primaryName} was found but it does not exactly match the primaryName: ${primaryName}.  Does the command list need further updates?`);
	});
}

export function testGetRecommendedRemovals(logger) {
	validatePrimaryNamesOfInterest(prefixWrapper('validatePrimaryNamesOfInterest', logger));
	const cases = [
	{'code': '', 'numRemovals': 0},
	{'code': 'forward 100', 'numRemovals': 0},
	{'code': 'penUp', 'numRemovals': 1},
	{'code': 'penDown', 'numRemovals': 1},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const testLogger = new TestParseLogger(noop, caseInfo.code);
		const tree = LogoParser.getParseTree(caseInfo.code, testLogger);
		const tokens = getDescendentsOfType(tree, ParseTreeTokenType.PARAMETERIZED_GROUP);
		const result = getRecommendedRemovals(tokens);
		if (typeof result !== 'object')
			plogger(`Expected result to be an object but got ${result}`);
		else {
			if (typeof result.isOnlyPenDown !== 'boolean')
				plogger(`Expected result.isOnlyPenDown to be boolean but got ${result.isOnlyPenDown}`);
			if (!(result.tokens instanceof Array))
				plogger(`Expected result.tokens to be an Array but got ${result.tokens}`);
			else if (result.tokens.length !== caseInfo.numRemovals)
				plogger(`Expected ${caseInfo.numRemovals} but found ${result.tokens.length}`);
		}
	});
};