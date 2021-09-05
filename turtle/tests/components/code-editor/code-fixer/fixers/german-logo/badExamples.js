import { fetchJson } from
'../../../../../../modules/fetchJson.js';

const migrationInfo = await fetchJson('json/logo-migrations/GermanCommodoreLogo.json');

// Some code examples that are mostly syntactically invalid or misuse commands.
// These can help us find cases where errors get thrown while trying to translate bad code.
const badExamples = [
	'wenn :x dann sonst',
	'wenn :x sonst'
];

for (const commandInfo of migrationInfo.commands) {
	badExamples.push(commandInfo.primaryName);
}
for (const keywordInfo of migrationInfo.keywords) {
	badExamples.push(keywordInfo.from);
}

export { badExamples };