export function processRemoveInMigrationKeywordsForScanTokens(scanTokens, migrationInfo) {
	if (migrationInfo.keywords === undefined)
		return; // nothing to do if we don't have any keywords migration data.

	const keywordsToRemove = new Set(migrationInfo.keywords.map(function(keywordInfo) {
		if (keywordInfo.removeInMigration === true) {
			return keywordInfo.from.toLowerCase();
		}
	}).filter(k => typeof k === 'string'));
	if (keywordsToRemove.size === 0)
		return; // nothing more to do.  No keywords to remove.

	for (let i = 0; i < scanTokens.length; i++) {
		const tokenS = scanTokens[i].s.toLowerCase();
		if (keywordsToRemove.has(tokenS)) {
			scanTokens.splice(i, 1);
			i--;
			// cancel the effect of i++
			// to remain at the same index for the next for-loop iteration.
		}
	}
	
};