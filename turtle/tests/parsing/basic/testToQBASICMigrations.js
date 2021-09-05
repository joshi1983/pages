import { exceptionToString } from '../../../modules/exceptionToString.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { validateFunctionsData } from
'./helpers/validateFunctionsData.js';
import { validateKeywordsData } from
'./helpers/validateKeywordsData.js';
import { validateOperatorsData } from
'./helpers/validateOperatorsData.js';

const paths = [
	'json/logo-migrations/basic/applesoft-basic/migrationToQBASIC.json',
	'json/logo-migrations/basic/bbc-basic/BBC_Basic_to_QBasic.json',
	'json/logo-migrations/basic/commodore-basic/migrationToQBasic.json',
	'json/logo-migrations/basic/sinclair-basic/migrationToQBasic.json',
	'json/logo-migrations/basic/tektronix-basic/migrationToQBasic.json',
	'json/logo-migrations/basic/trs-80-basic/migrationToQBASIC.json',
];

export async function testToQBASICMigrations(logger) {
	for (const path of paths) {
		const plogger = prefixWrapper(`path=${path}`, logger);
		try {
			const data = await fetchJson(path);
			validateFunctionsData(data.functions, prefixWrapper('validateFunctionsData', plogger));
			validateKeywordsData(data.keywords, prefixWrapper('validateKeywordsData', plogger));
			validateOperatorsData(data.operators, prefixWrapper('validateOperatorsData', plogger));
		}
		catch (e) {
			plogger(`Exception thrown while validating ${path}. e=${exceptionToString(e)}`);
		}
	}
};