import { Command } from
'../../../../../modules/parsing/Command.js';
import { isSingleCallEnoughForFillablePath, singleNotEnoughNames } from
'../../../../../modules/parsing/parse-tree-analysis/validation/poly-command-usage/isSingleCallEnoughForFillablePath.js';
import { ParseTreeToken } from
'../../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

function nameToTokenEnough(name) {
	const token = new ParseTreeToken(name, null, 0, 0, ParseTreeTokenType.PARAMETERIZED_GROUP);
	return isSingleCallEnoughForFillablePath(token);
}

function testSingleNotEnoughNames(logger) {
	for (const name of singleNotEnoughNames) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to find a command with name ${name}`);
		else if (info.primaryName !== name)
			logger(`Found a command similar to ${name} but it was named ${info.primaryName}.  A case sensitive match is required.`);
	}
}

function testWithTokens(logger) {
	const cases = [
	{'in': 'forward', 'out': false},
	{'in': 'fd', 'out': false},
	{'in': 'backward', 'out': false},
	{'in': 'jumpForward', 'out': false},
	{'in': 'jumpBackward', 'out': false},
	{'in': 'jumpLeft', 'out': false},
	{'in': 'jumpRight', 'out': false},
	{'in': 'jumpIn', 'out': false},
	{'in': 'jumpOut', 'out': false},
	{'in': 'setPos', 'out': false},
	{'in': 'arcRight', 'out': true},
	{'in': 'arcLeft', 'out': true},
	{'in': 'arcsLeft', 'out': true},
	{'in': 'arcsRight', 'out': true},
	{'in': 'arcLines', 'out': true},
	];
	testInOutPairs(cases, nameToTokenEnough, logger);
}

export function testIsSingleCallEnoughForFillablePath(logger) {
	wrapAndCall([
		testSingleNotEnoughNames,
		testWithTokens
	], logger);
};