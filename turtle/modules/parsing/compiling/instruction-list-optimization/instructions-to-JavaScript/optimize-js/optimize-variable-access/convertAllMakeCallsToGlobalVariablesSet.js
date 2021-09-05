import { convertMakeToGlobalVariablesSet } from './convertMakeToGlobalVariablesSet.js';
import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { isMakeAssignment } from '../token-classifiers/isMakeAssignment.js';
import { parse } from '../../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../../js-parsing/parseTreeTokensToCode.js';

export function convertAllMakeCallsToGlobalVariablesSet(jsCode) {
	const parseResult = parse(jsCode);
	const allTokens = flatten(parseResult.root);
	const makes = allTokens.filter(isMakeAssignment);
	makes.forEach(convertMakeToGlobalVariablesSet);
	return parseTreeTokensToCode(flatten(parseResult.root)).trim();
};