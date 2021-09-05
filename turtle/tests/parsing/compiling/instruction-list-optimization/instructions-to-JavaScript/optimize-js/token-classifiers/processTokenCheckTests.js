import { flatten } from '../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from '../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from '../../../../../../helpers/prefixWrapper.js';

export function processTokenCheckTests(cases, checkFunc, logger, _parse) {
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array but got ${cases}`);
	if (typeof checkFunc !== 'function')
		throw new Error(`checkFunc must be a function but got ${checkFunc}`);
	if (_parse !== undefined && typeof _parse !== 'function')
		throw new Error(`_parse must either be undefined or be a function but got ${_parse}`);
	if (_parse === undefined)
		_parse = parse;
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = _parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		const result = allTokens.filter(checkFunc);
		if (result.length !== caseInfo.numResults)
			plogger(`Expected numResults ${caseInfo.numResults} but found ${result.length}`);
	});
};