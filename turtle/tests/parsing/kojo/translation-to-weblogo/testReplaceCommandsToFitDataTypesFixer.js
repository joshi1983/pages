import { Command } from
'../../../../modules/parsing/Command.js';
import { LogoParser } from
'../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../../modules/parsing/loggers/ParseLogger.js';
import { parseTreeToCodeWithComments } from
'../../../../modules/parsing/parseTreeToCodeWithComments.js';
import { names, replaceCommandsToFitDataTypesFixer } from
'../../../../modules/parsing/kojo/translation-to-weblogo/replaceCommandsToFitDataTypesFixer.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function wrappedReplaceCommandsToFitDataTypesFixer(code) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined)
		return;
	replaceCommandsToFitDataTypesFixer(tree);
	return parseTreeToCodeWithComments(tree, code);
}

function checkConsistencyOfCommandNames(logger) {
	for (const name of names) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to find a command named ${name}`);
		else if (info.primaryName !== name)
			logger(`The primaryName must exactly match the name but ${name} does not equal primaryName ${info.primaryName}`);
	}
}

function testUsingInOutPairs(logger) {
	const cases = [
		{'in': 'setPenColor "red', 'changed': false},
		{'in': 'setFillColor "red', 'changed': false},
		{'in': 'setPenColor createRadialGradient pos 100 createPList',
			'out': 'setPenGradient createRadialGradient pos 100 createPList'},
		{'in': 'setFillColor createRadialGradient pos 100 createPList',
			'out': 'setFillGradient createRadialGradient pos 100 createPList'}
	];
	testInOutPairs(cases, wrappedReplaceCommandsToFitDataTypesFixer, logger);
}

export function testReplaceCommandsToFitDataTypesFixer(logger) {
	wrapAndCall([
		checkConsistencyOfCommandNames,
		testUsingInOutPairs
	], logger);
};