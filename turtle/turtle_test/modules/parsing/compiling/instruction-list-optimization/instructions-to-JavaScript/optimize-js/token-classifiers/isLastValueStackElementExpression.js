import { isLastContextValueStackElementExpression } from './isLastContextValueStackElementExpression.js';
import { isLastNoContextValueStackElementExpression } from './isLastNoContextValueStackElementExpression.js';

export function isLastValueStackElementExpression(token) {
	return isLastContextValueStackElementExpression(token) ||
	isLastNoContextValueStackElementExpression(token);
};