import { fetchJson } from '../../../fetchJson.js';
import { formatNumber } from '../../../formatNumber.js';
import { Vector2D } from '../../vector/Vector2D.js';
let pageSizes = await fetchJson('json/pageSizes.json');
pageSizes.sort((a, b) => a.name.localeCompare(b.name));

function formatInches(val) {
	return formatNumber(val, 2);
}

function calculateSizeDifference(pageSize, width, height) {
	const pageWidth = pageSize.getWidthPostScriptUnits();
	const pageHeight = pageSize.getHeightPostScriptUnits();
	const diffArea = Math.abs((pageWidth * pageHeight) - (width * height));
	const diffDimensions = Math.abs(pageWidth - width) + Math.abs(pageHeight - height);
	return Math.sqrt(diffArea) + diffDimensions;
}

export class PageSize {
	constructor(info, index) {
		this.index = index;
		this.name = info.name;
		if (info.shortName !== undefined)
			this.shortName = info.shortName;
		this.isDefault = info.isDefault;
		this.dimensionsInch = info.dimensionsInch;
	}

	createOption() {
		const result = document.createElement('option');
		result.setAttribute('value', this.index);
		if (this.isDefault)
			result.setAttribute('selected', '');
		result.innerText = this.toString();
		return result;
	}

	static fillSelect(selectElement) {
		selectElement.innerText = '';
		pageSizes.forEach(function(pageSize) {
			selectElement.appendChild(pageSize.createOption());
		});
	}

	getCentre() {
		return new Vector2D(this.getWidthPostScriptUnits() / 2, this.getHeightPostScriptUnits() / 2);
	}

	static getDefaultPageSize() {
		return pageSizes.filter(ps => ps.isDefault)[0];
	}

	getHeightInches() {
		return this.dimensionsInch.height;
	}

	getHeightPostScriptUnits() {
		return Math.round(this.getHeightInches() * 72);
	}

	static getPageSizes() {
		return pageSizes;
	}

	// width and height are assumed to be in PostScript points as in 72 points / inch
	static getPageSizeClosestToDimensions(width, height) {
		let bestIndex = 0;
		let minDifference = undefined;
		for (let i = 0; i < pageSizes.length; i++) {
			const sizeDifference = calculateSizeDifference(pageSizes[i], width, height);
			if (minDifference === undefined || minDifference > sizeDifference) {
				bestIndex = i;
				minDifference = sizeDifference;
			}
		}
		return pageSizes[bestIndex];
	}

	getShortName() {
		if (this.shortName !== undefined)
			return this.shortName;
		else
			return this.name;
	}

	getWidthInches() {
		return this.dimensionsInch.width;
	}

	getWidthPostScriptUnits() {
		return Math.round(this.getWidthInches() * 72);
	}

	toString() {
		return `${this.name} (${formatInches(this.getWidthInches())}x${formatInches(this.getHeightInches())} inches)`;
	}
};

pageSizes = pageSizes.map((s, index) => new PageSize(s, index));
