import { SmartRounder } from '../../vector/shapes/math/SmartRounder.js';

const rounder = new SmartRounder(0.1);

export function formatOpacity(opacityPercentage) {
	return rounder.formatNumber(opacityPercentage) + '%';
};