import { DataTypes } from '../../data-types/DataTypes.js';
await DataTypes.asyncInit();
const whitespace = /\s/;

function exceptionToTips(e, s) {
	if (typeof s === 'string') {
	}
	if (typeof e.message === 'string')
		return e.message;

	return 'Invalid datatypes expression';
}

export function dataTypes(s) {
	const index = s.indexOf(' ');
	if (index !== -1)
		return `A space must not be in data types expression but a space was found at index ${index} in "${s}"`;
	if (whitespace.test(s))
		return `A whitespace must not be in data types expression but one was found at index ${index} in "${s}"`;
	if (s.endsWith('|'))
		return `A datatypes expression must not end with | but got ${s}`;
	if (s.startsWith('|'))
		return `A datatypes expression must not start with | but got ${s}`;

	try {
		DataTypes.parse(s);
	}
	catch (e) {
		return exceptionToTips(e, s);
	}
};