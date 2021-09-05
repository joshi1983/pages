import { getMakeCommandNameForToken } from './getMakeCommandNameForToken.js';
import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { processToken } from '../processToken.js';

export function processMidStringAssignmentStart(token, result, options) {
	const argList = token.children[1];
	const argValues = argList.children.filter(mightBeDataValue);
	if (argValues.length < 2)
		return false; // indicate unable to process.
	const makeCommand = getMakeCommandNameForToken(token);
	const variableToken = argValues[0];
	const variableName = options.identifierRenameMap.get(variableToken.val.toLowerCase());
	result.append(`\n${makeCommand} "${variableName} `);
	if (argValues.length === 3) {
		result.append(`qbMidStringReplace4 :${variableName} `);
		processToken(argValues[1], result, options);
		result.append(' ');
		processToken(argValues[2], result, options);
	}
	else {
		result.append(`word midString :${variableName} 1 `);
		processToken(argValues[1], result, options);
		result.append(' - 1');
	}
	result.append(' ');
	return true;
};