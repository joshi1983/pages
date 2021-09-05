import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { Command } from
'../../../modules/parsing/Command.js';
import { FMSCommand } from
'../../../modules/parsing/fms-logo/FMSCommand.js';
import { fmsLogoExamples } from
'../../helpers/parsing/fmsLogoExamples.js';
import { distinctFMSCommands, isLikelyFMSLogo } from
'../../../modules/parsing/fms-logo/isLikelyFMSLogo.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';
await Command.asyncInit();

function testDistinctFMSNames(logger) {
	for (const name of distinctFMSCommands) {
		if (Command.getCommandInfo(name) !== undefined)
			logger(`Expected distinct FMS name ${name} to not be supported by WebLogo but it is found anyway.`);
		else if (Command.getCommandInfoByHintName(name) !== undefined)
			logger(`Expected distinct FMS name ${name} to not be in the hintNames of commands supported by WebLogo but it is found anyway.`);
		const info = FMSCommand.getCommandInfo(name);
		if (info === undefined)
			logger(`Expected every distinct FMS name ${name} to be in FMSLogo.json but did not.`);
	}
}

function testIsLikelyFMSLogoFunction(logger) {
	const cases = [
	{'in': ' void setup() {}', 'out': false},
	{'in': ' void setup() {perspective()}', 'out': false},
	];
	
	ArrayUtils.pushAll(cases, fmsLogoExamples.map(function(content) {
		return {
			'in': content,
			'out': true
		};
	}));
	testInOutPairs(cases, isLikelyFMSLogo, logger);
}

export function testIsLikelyFMSLogo(logger) {
	wrapAndCall([
		testDistinctFMSNames,
		testIsLikelyFMSLogoFunction
	], logger);
};