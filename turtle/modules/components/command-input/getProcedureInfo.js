import { tokensToLowerCaseStrings } from './tokensToLowerCaseStrings.js';
import { validateIdentifier } from '../../parsing/parse-tree-analysis/validateIdentifier.js';

function sanitizeLiteral(s) {
	while (s !== '' && ':"~!@#$%^&*()[]-+'.indexOf(s.charAt(0)) !== -1)
		s = s.substring(1);
	return s;
}

function procedureInfoToTemplate(procInfo) {
	let result = 'to ' + procInfo.name;
	procInfo.params.forEach(function(param) {
		result += ' :' + param;
	});
	return result + '\n\nend';
}

export function getProcedureInfo(tokens, uiCommandLowerCase) {
	tokens = tokens.filter(t => !t.isComment());
	const tokenStrings = tokensToLowerCaseStrings(tokens);
	const indexOfCmd = tokenStrings.indexOf(uiCommandLowerCase);
	if (indexOfCmd === -1)
		return undefined;
	if (indexOfCmd === 0 && tokens.length === 1)
		return {
			'name': '',
			'params': [],
			'templateCode': 'to\n\nend'
		};
	if (indexOfCmd === tokens.length - 1)
		return undefined;
	const params = [];
	for (let i = indexOfCmd + 2; i < tokens.length; i++) {
		let s = sanitizeLiteral(tokens[i].s);

		if (validateIdentifier(s) === undefined) {
			params.push(s);
		}
	}
	const result = {
		'name': sanitizeLiteral(tokens[indexOfCmd + 1].s),
		'params': params
	};
	result.templateCode = procedureInfoToTemplate(result);
	return result;
};