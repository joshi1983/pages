import { fixArrayReferenceArgLists } from './fixArrayReferenceArgLists.js';
import { fixOperatorPrecedence } from './fixOperatorPrecedence.js';
import { wrapIdentifiersAsFunctionCalls } from
'./wrapIdentifiersAsFunctionCalls.js';

const sanitizers = [
	fixArrayReferenceArgLists,
	fixOperatorPrecedence,
	wrapIdentifiersAsFunctionCalls
];	

export function sanitizeAll(root) {
	for (const sanitize of sanitizers) {
		sanitize(root);
	}
};