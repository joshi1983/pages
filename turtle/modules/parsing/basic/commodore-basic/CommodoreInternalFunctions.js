import { fetchJson } from
'../../../fetchJson.js';
import { QBasicInternalFunctions } from
'../qbasic/QBasicInternalFunctions.js';
const migrationData = await fetchJson('json/logo-migrations/basic/commodore-basic/migrationToQBasic.json');
const nameInfoMap = new Map();
for (const f of migrationData.functions) {
	if (f.to !== undefined &&
	f.args === undefined && f.argCount === undefined) {
		const qbInfo = QBasicInternalFunctions.getFunctionInfo(f.to);
		if (qbInfo !== undefined) {
			f.argCount = qbInfo.argCount;
			f.args = qbInfo.args;
		}
	}
	nameInfoMap.set(f.name.toLowerCase(), f);
}

export class CommodoreInternalFunctions {
	static getFunctionInfo(name) {
		name = name.toLowerCase();
		return nameInfoMap.get(name);
	}
};