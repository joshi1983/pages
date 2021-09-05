import { convertSpecificAnnotationsToLabels } from
'./convertSpecificAnnotationsToLabels.js';
import { fetchJson } from
'../../../../fetchJson.js';
import { insertEndSubs } from
'./insertEndSubs.js';
import { processMain } from
'./processMain.js';
import { processRemoveInMigration } from '../../helpers/processRemoveInMigration.js';
import { processSubs } from
'./processSubs.js';
import { removeGoSubSquareBrackets } from
'./removeGoSubSquareBrackets.js';
import { removeSpecificAnnotations } from
'./removeSpecificAnnotations.js';
import { scan as scanQBasic } from
'../../qbasic/scanning/scan.js';

const migrationData = await fetchJson('json/logo-migrations/basic/bazz-basic/migrationToQBASIC.json');

const processors = [
	convertSpecificAnnotationsToLabels,
	processMain,
	processSubs,
	removeGoSubSquareBrackets,
	removeSpecificAnnotations
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens);
	}
	processRemoveInMigration(scanTokens, migrationData);
	insertEndSubs(scanTokens);
		// do this only after all the subs were added.
	return scanTokens;
};