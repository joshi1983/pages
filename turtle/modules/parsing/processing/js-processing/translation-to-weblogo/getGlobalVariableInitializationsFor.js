import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from
'../../../LogoParser.js';
import { ParseLogger } from
'../../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { valueToLiteralCode } from
'../../../../valueToLiteralCode.js';

const globalVariableDefaults = new Map([
	['angleMode', 'radians'],
	['ellipseMode', 'radius'],
	['colorMode', 'rgb'],
	['colorMax', 256]
]);
const lowerCaseMap = new Map();
for (const key of globalVariableDefaults.keys()) {
	lowerCaseMap.set(key.toLowerCase(), key);
}

export function getGlobalVariableInitializationsFor(mainRoot, procsCode) {
	if (typeof procsCode !== 'string')
		throw new Error(`procsCode must be a string but found ${procsCode}`);

	const parseLogger = new ParseLogger();
	const procsRoot = LogoParser.getParseTree(procsCode, parseLogger);
	if (procsRoot === undefined) {
		return '';
	}
	const varReads = getDescendentsOfType(procsRoot, ParseTreeTokenType.VARIABLE_READ).
		filter(t => lowerCaseMap.has(t.val.toLowerCase()));
	const variableNamesOfInterestSet = new Set(varReads.map(t => lowerCaseMap.get(t.val.toLowerCase())));
	let result = '';
	if (variableNamesOfInterestSet.size !== 0) {
		const variableNamesOfInterestArray = Array.from(variableNamesOfInterestSet);
		variableNamesOfInterestArray.sort();
		result = '\n; Initialize some defaults.\n';
		for (const varName of variableNamesOfInterestArray) {
			result += 'make "' + varName + ' ' + valueToLiteralCode(globalVariableDefaults.get(varName)) + '\n';
		}
	}
	return result;
};