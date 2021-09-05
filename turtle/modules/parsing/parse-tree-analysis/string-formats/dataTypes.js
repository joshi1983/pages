import { DataTypes } from '../../data-types/DataTypes.js';
import { validateDataTypeString } from
'../../data-types/data-type-parsing/validateDataTypeString.js';
await DataTypes.asyncInit();

function exceptionToTips(e, s) {
	if (typeof s === 'string') {
	}
	if (typeof e.message === 'string')
		return e.message;

	return 'Invalid datatypes expression';
}

export function dataTypes(s) {
	const msg = validateDataTypeString(s);
	if (msg !== undefined)
		return msg;

	try {
		DataTypes.parse(s);
	}
	catch (e) {
		return exceptionToTips(e, s);
	}
};