import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';
import { TektronixCommands } from
'../TektronixCommands.js';
import { trigFunctions } from
'./replaceTrigFunctionNames.js';

const angleUnitNames = [
	'degrees',
	'gradians',
	'radians'
];

function isAngleUnitStart(s) {
	s = s.toLowerCase();
	for (const unit of angleUnitNames) {
		if (unit.startsWith(s))
			return true;
	}
	return false;
}

function getSetAngleUnitStartTokens(scanTokens) {
	const result = [];
	for (let i = 0; i < scanTokens.length - 1; i++) {
		const setToken = scanTokens[i];
		if (setToken.s.toLowerCase() !== 'set')
			continue;
		const nextToken = scanTokens[i + 1];
		if (isAngleUnitStart(nextToken.s))
			result.push(i);
	}
	return result;
}

function isAnySetNotDegrees(setAngleUnitIndexes, scanTokens) {
	for (let i of setAngleUnitIndexes) {
		const unitToken = scanTokens[i + 1];
		if (unitToken.s[0].toLowerCase() !== 'd')
			return true;
	}
	return false;
}

function isSafeToIgnore(scanToken) {
	if (!isIdentifier(scanToken.s))
		return true;
	if (trigFunctions.has(scanToken.s.toLowerCase()))
		return false;
	const info = TektronixCommands.getFunctionInfo(scanToken.s);
	if (info !== undefined)
		return true;
	else {
		// if scanToken.s corresponds with a label, subroutine, or function name?
			// return false.
		// return true.
	}
	return false;
}

export function areAllTrigCallsInDegrees(scanTokens) {
	const setAngleUnitIndexes = getSetAngleUnitStartTokens(scanTokens);
	if (setAngleUnitIndexes.length !== 0) {
		if (isAnySetNotDegrees(setAngleUnitIndexes, scanTokens))
			return false;
		const firstSetIndex = setAngleUnitIndexes[0];
		for (let i = 0; i < firstSetIndex; i++) {
			if (!isSafeToIgnore(scanTokens[i]))
				return false;
		}
		return true;
	}
	return false;
};