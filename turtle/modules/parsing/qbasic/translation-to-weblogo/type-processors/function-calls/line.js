import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';
import { processTokens } from '../helpers/processTokens.js';

const shapeIndicators = new Set(['b', 'bf']);

function isShapeIndicator(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return shapeIndicators.has(token.val.toLowerCase());
}

function isBoxIndicated(argChildren) {
	for (let i = 1; i < argChildren.length; i++) {
		const child = argChildren[i];
		if (isShapeIndicator(child) &&
		child.val.toLowerCase() === 'b')
			return true;
	}
	return false;
}

function isFillBoxIndicated(argChildren) {
	for (let i = 1; i < argChildren.length; i++) {
		const child = argChildren[i];
		if (isShapeIndicator(child) &&
		child.val.toLowerCase() === 'bf')
			return true;
	}
	return false;
}

function isHyphenBeforeCoordinates(argChildren) {
	const first = argChildren[0];
	return first !== undefined &&
	first.type === ParseTreeTokenType.UNARY_OPERATOR &&
	first.val === '-';
}

export function getToName(token) {
	const argList = token.children[1];
	const ch = argList.children.filter(mightBeDataValue);
	const minus = ch[0];
	let name;
	if (ch.length === 1) {
		 if (minus.type !== ParseTreeTokenType.BINARY_OPERATOR ||
			minus.children.length !== 2)
			return 'setPos'; // indicate unable to process.
		name = 'qbLine2';
	}
	else if (isBoxIndicated(ch)) {
		if (ch.length === 2)
			name = 'qbBox2';
		else
			name = 'qbBox3';
	}
	else if (isFillBoxIndicated(ch)) {
		if (ch.length === 2)
			name = 'qbFilledBox2';
		else
			name = 'qbFilledBox3';
	}
	else if (isHyphenBeforeCoordinates(ch))
		name = 'qbLineFromHere';
	else {
		name = 'qbLineColor';
	}
	return name;
};

export function line(token, result, options) {
	result.processCommentsUpToToken(token);
	const argList = token.children[1];
	const ch = argList.children;
	const name = getToName(token);
	result.append('\n' + name + ' ');
	for (const child of argList.children.filter(mightBeDataValue)) {
		if (isShapeIndicator(child)) {
			if (name.startsWith('qbBox') || name.startsWith('qbFilledBox'))
				continue;
			result.append(` "${name} `);
			continue;
		}
		else if (child.type === ParseTreeTokenType.BINARY_OPERATOR &&
		child.val === '-') {
			processTokens(child.children, result, options);
			continue;
		}
		else if (child.type === ParseTreeTokenType.UNARY_OPERATOR &&
		child.val === '-' &&
		child.children.length !== 0) {
			processToken(child.children[0], result, options);
			continue;
		}
		processToken(child, result, options);
	}
	result.append('\n');
};