import { isIdentifier } from
'./isIdentifier.js';
import { MigrationInfo } from
'../MigrationInfo.js';

const keywords = new Set();
for (const keywordInfo of MigrationInfo.getData().keywords) {
	keywords.add(keywordInfo.from.toLowerCase());
}

export function isIdentifier(s) {
	s = s.toLowerCase();
	if (!isIdentifier(s))
		return false;

	if (keywords.has(s))
		return false;

	return true;
};