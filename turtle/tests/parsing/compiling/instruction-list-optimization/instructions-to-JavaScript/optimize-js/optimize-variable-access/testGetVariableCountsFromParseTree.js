import { getVariableCountsFromParseTree } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getVariableCountsFromParseTree.js';
import { MaybeDecided } from
'../../../../../../../modules/MaybeDecided.js';
import { parse } from
'../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

export function testGetVariableCountsFromParseTree(logger) {
	const cases = [
	{'code': '', 'numVariables': 0},
	{'code': 'context.turtle.right(180)', 'numVariables': 0},
	{'code': 'context.make("z",30)', 'numVariables': 1, 'varNames': ['z'], 'checks': [
		{'name': 'z', 'numReads': 0, 'numWrites': 1, 'isAlwaysLocal': MaybeDecided.Maybe, 'isAlwaysGlobal': MaybeDecided.Maybe}
	]},
	{'code': 'context.localmake("oldstate",context.turtle.turtleState())',
	'numVariables': 1, 'varNames': ['oldstate'], 'checks': [
		{'name': 'oldstate', 'numReads': 0, 'numWrites': 1, 'isAlwaysLocal': MaybeDecided.Yes, 'isAlwaysGlobal': MaybeDecided.No}
	]},
	{'code': 'context.turtle.setHeading(this.validateNumber((context.getCurrentExecutingProcedure().localVariables.get("oldheading")) + (((context.repcount()) * 360) / 2)))',
	'numVariables': 1, 'varNames': ['oldheading'], 'checks': [
		{'name': 'oldheading', 'numReads': 1, 'numWrites': 0, 'isAlwaysLocal': MaybeDecided.Yes, 'isAlwaysGlobal': MaybeDecided.No}
	]},
	{'code': 'context.turtle.print(context.globalVariables.get("x"))', 'numVariables': 1, 'varNames': ['x'], 'checks': [
		{'name': 'x', 'numReads': 1, 'numWrites': 0, 'isAlwaysLocal': MaybeDecided.No, 'isAlwaysGlobal': MaybeDecided.Yes}
	]},
	{'code': 'context.globalVariables.get("seatcolor")', 'numVariables': 1, 'varNames': ['seatcolor'], 'checks': [
		{'name': 'seatcolor', 'numReads': 1, 'numWrites': 0, 'isAlwaysLocal': MaybeDecided.No, 'isAlwaysGlobal': MaybeDecided.Yes}
	]},
	{'code': 'context.localmake("x", 1);\ncontext.turtle.forward(context.readVariable("x"))',
	'numVariables': 1,
	'varNames': ["x"],
	"checks": [
		{'name': 'x', 'numReads': 1, 'numWrites': 1, 'isAlwaysLocal': MaybeDecided.Yes, 'isAlwaysGlobal': MaybeDecided.No}
	]},
	{'code': `context.make("treadcolor","black");
context.make("framecolor","skyBlue");
context.make("frameshadecolor",context.math.mix(context.globalVariables.get("framecolor"),"black",0.6));
context.make("seatcolor","black");`,
	'numVariables': 4,
	'varNames': ['treadcolor', 'framecolor', 'frameshadecolor', 'seatcolor']}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const varCounts = getVariableCountsFromParseTree(parseResult.root);
		if (!(varCounts instanceof Map))
			plogger(`Expected getVariableCountsFromParseTree to return a Map but got ${varCounts}`);
		else {
			if (caseInfo.numVariables !== undefined && varCounts.size !== caseInfo.numVariables)
				plogger(`Expected number of variables to be ${caseInfo.numVariables} but got ${varCounts.size}`);
			if (caseInfo.varNames instanceof Array) {
				caseInfo.varNames.forEach(function(varName) {
					if (!varCounts.has(varName))
						plogger(`Expected to find a variable named ${varName} but did not.  The variable names are: ${Array.from(varCounts.keys()).join(',')}`);
				});
			}
			if (caseInfo.checks instanceof Array) {
				caseInfo.checks.forEach(function(checkInfo, cIndex) {
					const clogger = prefixWrapper(`Check info ${cIndex}`, plogger);
					const variableInfo = varCounts.get(checkInfo.name);
					if (variableInfo === undefined)
						clogger(`Unable to find variable information for ${checkInfo.name}`);
					else {
						if (variableInfo.readTokens.length !== checkInfo.numReads)
							clogger(`Expected number of read tokens to be ${checkInfo.numReads} but found ${variableInfo.readTokens.length}`);
						if (variableInfo.writeTokens.length !== checkInfo.numWrites)
							clogger(`Expected number of write tokens to be ${checkInfo.numWrites} but found ${variableInfo.writeTokens.length}`);
						if (checkInfo.isAlwaysLocal !== undefined) {
							if (checkInfo.isAlwaysLocal !== variableInfo.isAlwaysLocal) {
								clogger(`Expected isAlwaysLocal to be ${MaybeDecided.stringify(checkInfo.isAlwaysLocal)} but got ${MaybeDecided.stringify(variableInfo.isAlwaysLocal)}`);
							}
						}
						if (checkInfo.isAlwaysGlobal !== undefined) {
							if (checkInfo.isAlwaysGlobal !== variableInfo.isAlwaysGlobal) {
								clogger(`Expected isAlwaysGlobal to be ${MaybeDecided.stringify(checkInfo.isAlwaysGlobal)} but got ${MaybeDecided.stringify(variableInfo.isAlwaysGlobal)}`);
							}
						}
					}
				});
			}
		}
	});
};