import { convertDoubleSlashSingleLineComments } from
'../../helpers/convertDoubleSlashSingleLineComments.js';
import { fetchJson } from '../../../../fetchJson.js';
import { genericProcessTo } from
'../../helpers/genericProcessTo.js';
import { processCurlyBrackets } from
'./processCurlyBrackets.js';
import { processKeywords } from
'../../helpers/processKeywords.js';
import { processVarDeclarations } from
'./processVarDeclarations.js';
import { removeUntranslatableTokens } from
'./removeUntranslatableTokens.js';
import { scan as scanQBasic } from
'../../qbasic/scanning/scan.js';

const migrationData = await fetchJson('json/logo-migrations/basic/pbasic/migrationToQBasic.json');

function shouldBeSkipped(scanTokens, index) {
	if (index === 0)
		return false;

	const prev = scanTokens[index - 1];
	if (prev.s.toLowerCase() === 'var')
		return true; // don't rename variable names in a variable declaration.
	const next = scanTokens[index + 1];
	if (next !== undefined && next.s === ':')
		return true; // likely specifying a data type.
	return false;
}

const processors = [
	convertDoubleSlashSingleLineComments,
	genericProcessTo(migrationData, shouldBeSkipped),
	processCurlyBrackets,
	processVarDeclarations,
	removeUntranslatableTokens
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens);
	}
	processKeywords(scanTokens, migrationData);
	return scanTokens;
};