import { convertComments } from
'./convertComments.js';
import { fetchJson } from '../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { removePreprocessorDirectives } from
'./removePreprocessorDirectives.js';
import { scan as scanQBasic } from '../../qbasic/scanning/scan.js';

const migrationData = await fetchJson('json/logo-migrations/basic/basil/Basil_Basic_to_QBasic.json');
const processors = [
	convertComments,
	genericProcessTo(migrationData),
	removePreprocessorDirectives
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens);
	}
	return scanTokens;
};