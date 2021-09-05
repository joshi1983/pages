import { convertRepeatLoopKeywords } from
'./convertRepeatLoopKeywords.js';
import { convertEndWhileToWend } from
'./convertEndWhileToWend.js';
import { fetchJson } from
'../../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { genericSingleCharacterSingleLineCommentToREM } from
'../../helpers/genericSingleCharacterSingleLineCommentToREM.js';
import {  processTypedDeclarations } from
'./processTypedDeclarations.js';
import { processKeywords } from
'../../helpers/processKeywords.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { scan as scanQBasic } from
'../../qbasic/scanning/scan.js';
import { splitExclamationMarkFromNumberLiterals } from
'./splitExclamationMarkFromNumberLiterals.js';

const migrationData = await fetchJson('json/logo-migrations/basic/htbasic/HTBasic_to_QBasic.json');

function processKeywords_(scanTokens) {
	processKeywords(scanTokens, migrationData);
}

function removeTokens(scanTokens) {
	processRemoveInMigration(scanTokens, migrationData)
}

const processors = [
	convertRepeatLoopKeywords,
	convertEndWhileToWend,
	splitExclamationMarkFromNumberLiterals,
	genericSingleCharacterSingleLineCommentToREM('!'),
	genericProcessTo(migrationData),
	processTypedDeclarations,
	processKeywords_,
	removeTokens
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens);
	}
	return scanTokens;
};