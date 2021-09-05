import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { processTokens } from '../helpers/processTokens.js';

function filterToValueTokens(argList) {
	return argList.children.filter(mightBeDataValue);
}

export function getToName(token) {
	const argList = token.children[1];
	const ch = filterToValueTokens(argList);
	let name;
	if (ch.length < 2)
		return; // indicate not of interest.
	if (ch.length === 2)
		name = 'qbCircleCoordsRadius';
	else if (ch.length === 3)
		name = 'qbCircleCoordsRadiusColor';
	else if (ch.length >= 6)
		name = 'qbCircle6';
	else
		name = 'qbCircle5';
	return name;
};

export function circle(token, result, options) {
	const argList = token.children[1];
	const ch = filterToValueTokens(argList);
	const name = getToName(token);
	if (name === undefined)
		return; // do not translate.
	result.append('\n' + name + ' ');
	processTokens(ch, result, options);
};