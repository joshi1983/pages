import { flatten } from '../../../generic-parsing-utilities/flatten.js';
import { isDynamicVariableNameMakeAssignment } from './optimize-js/token-classifiers/isDynamicVariableNameMakeAssignment.js';
import { parse } from '../../../js-parsing/parse.js';

function isMakeOfInterest(token) {
	if (!isLocalmakeAssignment(token) && !isMakeAssignment(token))
		return false;
	return true;
}

export function containsDynamicVariableAssignment(code) {
	if (typeof code !== 'string')
		return false;
	const parseResult = parse(code);
	return flatten(parseResult.root).filter(isDynamicVariableNameMakeAssignment);
};