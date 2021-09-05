import { consistentLabelPrefixes } from './consistentLabelPrefixes.js';
import { removeUnusedLabels } from './removeUnusedLabels.js';

const sanitizers = [
consistentLabelPrefixes,
removeUnusedLabels
];

export function sanitize(root) {
	sanitizers.forEach(sanitize => sanitize(root));
};