import { fetchJson } from '../../../fetchJson.js';
import { Resolutions } from '../Resolutions.js';

function createResolutionListElement(setDimensions, hide) {
	const result = document.createElement('div');
	result.classList.add('resolution-dropdown-resolutions');
	Resolutions.getData().forEach(function(resolution) {
		const e = Resolutions.resolutionInfoToDiv(resolution);
		e.addEventListener('click', function() {
			setDimensions(resolution.width, resolution.height);
			hide();
		});
		result.appendChild(e);
	});
	return result;
}

export class ResolutionDropdown {
	constructor(togglerID, setDimensions) {
		if (typeof togglerID !== 'string')
			throw new Error('togglerID must be a string');
		if (typeof setDimensions !== 'function')
			throw new Error('setDimensions must be a function');

		this._setDimensions = setDimensions;
		const collapseToggleButton = document.getElementById(togglerID);
		if (collapseToggleButton === null)
			throw new Error('Unable to find element with id ' + togglerID);
		const outer = this;
		collapseToggleButton.addEventListener('mousemove', function() {
			outer.show();
		});
		this.collapseToggleButton = collapseToggleButton;
	}

	hide() {
		this.listElement.remove();
		this.collapseToggleButton.classList.remove('showing-list');
	}

	show() {
		if (this.listElement === undefined) {
			const outer = this;
			function hide() {
				outer.hide();
			}
			this.listElement = createResolutionListElement(function(width, height) {
				outer._setDimensions(width, height);
			}, hide);
			this.listElement.addEventListener('mouseleave', function(event) {
				hide();
			});
		}
		const parent = this.collapseToggleButton.parentNode;
		parent.appendChild(this.listElement);
		this.collapseToggleButton.classList.add('showing-list');
	}
};