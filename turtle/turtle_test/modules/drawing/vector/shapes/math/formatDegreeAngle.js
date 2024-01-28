import { SmartRounder } from './SmartRounder.js';
const rounder = new SmartRounder(0.00001);

export function formatDegreeAngle(degrees) {
	return rounder.formatNumber(degrees);
};