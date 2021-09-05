import { addColonsForVariableReads } from
'./addColonsForVariableReads.js';
import { addQuotesInSetStatements } from
'./addQuotesInSetStatements.js';
import { addSquareBrackets } from
'./addSquareBrackets.js';
import { fetchJson } from
'../../../../../../fetchJson.js';
import { joinLongStringLiterals } from
'./joinLongStringLiterals.js';
import { processStringTemplates } from
'./processStringTemplates.js';
import { quoteColourNames } from
'./quoteColourNames.js';
import { scanWithMigration } from
'../../helpers/scanWithMigration.js';

const migrationInfo = await fetchJson('json/logo-migrations/sea-turtle/SeaTurtle.json');

const tokenProcessors = [
	addColonsForVariableReads,
	addQuotesInSetStatements,
	addSquareBrackets,
	joinLongStringLiterals,
	processStringTemplates,
	quoteColourNames
];

export function scan(code) {
	const tokens = scanWithMigration(code, migrationInfo);
	for (const process of tokenProcessors)
		process(tokens);
	return tokens;
};