import { evaluateToken } from '../evaluation/evaluateToken.js';
import { getNameFrom } from '../parsing/parse-tree-analysis/getNameFrom.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { ZeroLProperties } from '../ZeroLProperties.js';

export function getPropertyValues(root) {
	const result = new Map();
	const assignments = root.children.filter(t => t.type === ParseTreeTokenType.ASSIGNMENT);
	for (const assignment of assignments) {
		const firstChild = assignment.children[0];
		const valueChild = assignment.children[1];
		if (valueChild !== undefined) {
			const value = evaluateToken(valueChild);
			if (value !== undefined) {
				const name = getNameFrom(firstChild);
				const propertyInfo = ZeroLProperties.getPropertyInfo(name);
				if (propertyInfo !== undefined && propertyInfo.to !== undefined) {
					result.set(propertyInfo.to, value);
				}
			}
		}
	}
	return result;
};