import { fetchJson } from
'../../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { genericSingleCharacterSingleLineCommentToREM } from
'../../helpers/genericSingleCharacterSingleLineCommentToREM.js';
import { processRemoveInMigration } from
'../../helpers/processRemoveInMigration.js';
import { scan as scanQBasic } from
'../../qbasic/scanning/scan.js';

const migrationData = await fetchJson('json/logo-migrations/basic/htbasic/HTBasic_to_QBasic.json');

function removeTokens(scanTokens) {
	processRemoveInMigration(scanTokens, migrationData)
}

const processors = [
	genericSingleCharacterSingleLineCommentToREM('!'),
	genericProcessTo(migrationData),
	removeTokens
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens);
	}
	return scanTokens;
};