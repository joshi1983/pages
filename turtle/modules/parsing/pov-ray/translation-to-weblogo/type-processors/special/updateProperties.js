import { isCompleteValueToken } from '../../../parsing/isCompleteValueToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { PovRayCommand } from '../../../PovRayCommand.js';

const ignoredTypes = new Set([
ParseTreeTokenType.COMMA,
ParseTreeTokenType.CURLY_LEFT_BRACKET,
ParseTreeTokenType.CURLY_RIGHT_BRACKET
]);

function getNextIndex(children, startIndex) {
	let i = startIndex + 1;
	while (i < children.length) {
		const child = children[i];
		if (ignoredTypes.has(child.type)) {
			i++;
			continue;
		}
		if (isCompleteValueToken(child))
			return i;
		return -1;
	}
	return -1;
}

export function updateProperties(token, properties) {
	const info = PovRayCommand.getCommandInfo(token.val);
	if (info !== undefined && token.children.length !== 0) {
		const argInfo = info.args[0];
		const children = token.children[0].children;
		let childIndex = getNextIndex(children, -1);
		if (childIndex !== -1 && argInfo.subArgs !== undefined) {
			for (let i = 0; i < argInfo.subArgs.length; i++) {
				const subArg = argInfo.subArgs[i];
				const name = subArg.name;
				const child = children[childIndex];
				if (isCompleteValueToken(child)) {
					properties.set(name, child);
				}
				else
					break;
				childIndex = getNextIndex(children, childIndex);
				if (childIndex === -1)
					break;
			}
		}
	}
};