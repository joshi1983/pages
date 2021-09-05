import { Vector3D } from '../Vector3D.js';

const numberKeys = ['position.x', 'position.y', 'position.z', {'key': 'zoom.scale', 'default': 1}];

export class SnapshotStyle {
	constructor(properties) {
		if (!(properties instanceof Map))
			throw new Error('properties must be a Map.  Not: ' + properties);

		const sanitizedProperties = new Map(properties);
		numberKeys.forEach(function(keyInfo) {
			const key = typeof keyInfo === 'object' ? keyInfo.key : keyInfo;
			let value = properties.get(key);
			if (typeof value !== 'number' || isNaN(value)) {
				value = 0;
				if (typeof keyInfo === 'object')
					value = keyInfo.default;
				sanitizedProperties.set(key, value);
			}
		});
		this.position = new Vector3D(
			sanitizedProperties.get('position.x'),
			sanitizedProperties.get('position.y'),
			sanitizedProperties.get('position.z')
		);
		this.zoomScale = sanitizedProperties.get('zoom.scale');
	}

	getDimensionsForAspectRatio(aspectRatio) {
		if (typeof aspectRatio !== 'number')
			throw new Error('aspectRatio must be a number.  Not: ' + aspectRatio);

		const area = 500000 / (this.zoomScale * this.zoomScale);
		// The returned dimensions will always be such that width * height = area.
		// They also satisfy width = height * aspectRatio.
		const height = Math.sqrt(area / aspectRatio);
		return {
			'width': height * aspectRatio,
			'height': height
		};
	}

	setZoomScale(zoomScale) {
		if (typeof zoomScale !== 'number' || isNaN(zoomScale))
			throw new Error('zoomScale must be a number.  Not: ' + zoomScale);
		this.zoomScale = zoomScale;
	}
};