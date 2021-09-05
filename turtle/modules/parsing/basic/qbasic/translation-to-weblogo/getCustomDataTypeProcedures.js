import { fetchText } from '../../../../fetchText.js';
import { getReferencedCustomTypes } from './getReferencedCustomTypes.js';
import { getTypeName } from './type-processors/helpers/getTypeName.js';
import { isArrayOfCustomTypeUsed } from './isArrayOfCustomTypeUsed.js';
import { SetUtils } from '../../../../SetUtils.js';
import { StringBuffer } from '../../../../StringBuffer.js';
import { typeTokenToCreateProcedure } from './typeTokenToCreateProcedure.js';
import { typeTokenToName } from './typeTokenToName.js';

const initPair = ['initlist', await fetchText('logo-scripts/qbasic/initList.lgo')];

export function getCustomDataTypeProcedures(root, options) {
	const typeToCreateProcName = new Map();
	options.typeToCreateProcName = typeToCreateProcName;
	const customTypes = getReferencedCustomTypes(root);
	if (customTypes.length !== 0) {
		const procsToAddSet = new Set();
		const procsMap = new Map([
			initPair
		]);
		if (isArrayOfCustomTypeUsed(root))
			procsToAddSet.add('initList');
		SetUtils.addAll(procsToAddSet, customTypes.map(function(typeToken) {
			const procName = typeTokenToName(typeToken, options);
			const procDefinition = typeTokenToCreateProcedure(typeToken, procName);
			procsMap.set(procName, procDefinition);
			typeToCreateProcName.set(getTypeName(typeToken), procName);
			return procName;
		}));
		const procsArray = Array.from(procsMap.keys());
		procsArray.sort();
		const result = new StringBuffer();
		for (const procName of procsArray) {
			result.append(procsMap.get(procName) + '\n');
		}
		return result.toString();
	}
	return '';
};