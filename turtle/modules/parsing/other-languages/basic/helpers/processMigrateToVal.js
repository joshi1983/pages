import { genericProcessTo } from './genericProcessTo.js';

function convertMigrateToValToTo(functions) {
	if (!(functions instanceof Array))
		throw new Error(`functions must be an Array but found ${functions}.`);

	const result = [];
	for (const f of functions) {
		if (typeof f.migrateToVal === 'string') {
			const obj = {};
			Object.assign(obj, f);
			obj.to = f.migrateToVal;
			delete obj.migrateToVal;
			result.push(obj);
		}
	}
	return result;
}

export function processMigrateToVal(migrationInfo) {
	const modifiedMigration = {
		'functions': convertMigrateToValToTo(migrationInfo.functions)
	};
	return genericProcessTo(modifiedMigration);
};