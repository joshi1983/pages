import { isJoystApplicableTo, joyst } from './function-calls/joyst.js';
import { isKeyApplicableTo, key } from './function-calls/key.js';
import { ParseTreeTokenType } from '../../../qbasic/ParseTreeTokenType.js';

const processors = [
	joyst, key
];
const processorsMap = new Map();
for (const processor of processors) {
	processorsMap.set(processor.name, processor);
}
const applicableChecks = new Map([
	['joyst', isJoystApplicableTo],
	['key', isKeyApplicableTo]
]);

export function isApplicableTo(token) {
	const children = token.children;
	if (children.length !== 2)
		return false;

	const nameToken = children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.children.length !== 0 ||
	!processorsMap.has(nameToken.val.toLowerCase()))
		return false;

	const argList = token.children[1];
	if (argList.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	
	const name = nameToken.val.toLowerCase();
	const checker = applicableChecks.get(name);
	if (checker !== undefined)
		return checker(token);
	
	return true;
};

export function processFunctionCall(token, result, options) {
	const nameToken = token.children[0];
	const processor = processorsMap.get(nameToken.val.toLowerCase());
	processor(token, result, options);
};