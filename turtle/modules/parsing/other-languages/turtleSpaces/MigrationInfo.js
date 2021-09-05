import { fetchJson } from
'../../../fetchJson.js';
import { sanitizeMigrationInfo } from
'../../../components/code-editor/code-fixer/fixers/helpers/sanitizeMigrationInfo.js';

const MigrationInfo = await fetchJson('json/logo-migrations/turtleSpaces.json');
sanitizeMigrationInfo(MigrationInfo);

export { MigrationInfo };