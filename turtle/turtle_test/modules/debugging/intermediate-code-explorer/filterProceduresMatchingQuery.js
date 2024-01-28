import { sanitizeQuery } from '../../components/sanitizeQuery.js';

export function filterProceduresMatchingQuery(query, proceduresMap) {
	if (typeof query !== 'string')
		throw new Error('query must be a string');
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be an instance of Map');

	query = sanitizeQuery(query);
	const result = [];
	for (const [key, value] of proceduresMap) {
		if (value.name.indexOf(query) === 0)
			result.push(value);
	}
	return result;
};