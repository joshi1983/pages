import { numberNames } from
'./parse-tree-analysis/variable-data-types/numberNames.js';

const dataTypes = [
// some QB64 types mentioned at:
// https://en.wikibooks.org/wiki/QBasic/Arrays_and_Types
// and https://wiki.qb64.dev/qb64wiki/index.php/UNSIGNED
// We want the QBasic parser to work for both Microsoft QBasic and QB64.
	['_offset'],
	['_unsigned', '_bit'],
	['_unsigned', '_byte'],
	['_unsigned', 'integer'],
	['_unsigned', '_integer64'],
	['_unsigned', 'long'],
	['_unsigned', '_offset'],
	['string'],
];
numberNames.forEach(function(name) {
	dataTypes.push([name]);
});

export { dataTypes };

export function isCompleteDataTypeToken(token) {
	const children = token.children;
	if (children.length < 1)
		return false;
	if (children.length >= 2)
		return true;
	const firstChild = children[0];
	if (firstChild.val === null)
		return true;
	return firstChild.val.toLowerCase() !== '_unsigned';
};