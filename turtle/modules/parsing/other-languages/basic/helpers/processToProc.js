import { genericProcessTo } from './genericProcessTo.js';

function convertToProcToTo(functions) {
	if (!(functions instanceof Array))
		throw new Error(`functions must be an Array but found ${functions}.`);

	const result = [];
	for (const f of functions) {
		if (typeof f.toProc === 'string') {
			const obj = {};
			Object.assign(obj, f);
			obj.to = f.toProc;
			delete obj.toProc;
			result.push(obj);
		}
	}
	return result;
}

export function processToProc(migrationInfo) {
	const modifiedMigration = {
		'functions': convertToProcToTo(migrationInfo.functions)
	};
	return genericProcessTo(modifiedMigration);
};