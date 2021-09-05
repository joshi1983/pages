import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { fetchText } from
'../../../../modules/fetchText.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { validateFunctionsData } from
'./validateFunctionsData.js';
import { validateKeywordsData } from
'./validateKeywordsData.js';
import { validateOperatorsData } from
'./validateOperatorsData.js';

const s = await fetchText('json/logo-migrations/basic/bbc-basic/BBC_Basic_to_QBasic.json');

export function testBBCToQBasicData(logger) {
	let data;
	try {
		data = JSON.parse(s);
	} catch (e) {
		logger(`Invalid JSON. s=${s}, e=${exceptionToString(e)}`);
		return;
	}
	validateFunctionsData(data.functions, prefixWrapper('validateFunctionsData', logger));
	validateKeywordsData(data.keywords, prefixWrapper('validateKeywordsData', logger));
	validateOperatorsData(data.operators, prefixWrapper('validateOperatorsData', logger));
};