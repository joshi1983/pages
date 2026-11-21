import { flatten } from '../../../generic-parsing-utilities/flatten.js';
import { isDynamicVariableNameMakeAssignment } from './optimize-js/token-classifiers/isDynamicVariableNameMakeAssignment.js';
import { parse,
	asyncInit as parseAsyncInit } from
'../../../other-languages/js-parsing/parse.js';

export async function asyncInit() {
	await parseAsyncInit();
};

export function containsDynamicVariableAssignment(code) {
	if (typeof code !== 'string')
		return false;
	const parseResult = parse(code);
	return flatten(parseResult.root).some(isDynamicVariableNameMakeAssignment);
};