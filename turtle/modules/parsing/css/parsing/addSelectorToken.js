import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function addRuleSetToken(selectorToken) {
	const ruleSetToken = new ParseTreeToken(null, selectorToken.lineIndex, selectorToken.colIndex, ParseTreeTokenType.RULE_SET);
	const selectorParent = selectorToken.parentNode;
	selectorToken.remove();
	ruleSetToken.appendChild(selectorToken);
	selectorParent.appendChild(ruleSetToken);
}

export function addSelectorToken(token) {
	if (token.type === ParseTreeTokenType.DECLARATION_BLOCK &&
	token.children.length > 1)
		token = token.children[token.children.length - 1];
	if (token.type === ParseTreeTokenType.DECLARATION)
		token = token.removeSingleToken();
	const tokenParent = token.parentNode;
	const selectorToken = new ParseTreeToken(null, token.lineIndex, token.colIndex, ParseTreeTokenType.SELECTOR);
	if (tokenParent !== null) {
		tokenParent.replaceChild(token, selectorToken);
		selectorToken.appendChild(token);
	}
	else {
		token.appendChild(selectorToken);
	}
	addRuleSetToken(selectorToken);
	return selectorToken;
};