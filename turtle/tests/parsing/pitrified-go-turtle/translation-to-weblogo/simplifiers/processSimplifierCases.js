import { assertEquals } from
'../../../../helpers/assertEquals.js';
import { parse } from
'../../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { toGoCode } from
'../../../../../modules/parsing/pitrified-go-turtle/parsing/toGoCode.js';

export function processSimplifierCases(cases, func, logger) {
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array but found ${cases}`);
	if (typeof func !== 'function')
		throw new Error(`func must be a function but found ${func}`);
	cases.forEach(function(caseInfo, index) {
		if (typeof caseInfo.code !== 'string')
			throw new Error(`code must be a string but found ${caseInfo.code}`);
		if (caseInfo.to !== undefined && typeof caseInfo.changed === 'boolean')
			throw new Error(`If changed is specified, to should not be.  changed=${caseInfo.changed}, out=${caseInfo.to}`);

		if (caseInfo.changed === false)
			caseInfo.to = caseInfo.code;
		if (typeof caseInfo.to !== 'string')
			throw new Error(`Case ${index}: to must be a string but found ${caseInfo.to}.  changed=#{caseInfo.changed}`);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const root = parseResult.root;
		const continueSimplifyingResult = func(root);
		const resultStr = toGoCode(root);
		if (typeof continueSimplifyingResult !== 'boolean')
			plogger(`The return value should be boolean but found ${continueSimplifyingResult}`);
		assertEquals(caseInfo.to, resultStr, plogger);
	});
};