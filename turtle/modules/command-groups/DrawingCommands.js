export class DrawingCommands {
	constructor(settings) {
		this.settings = settings;
	}

	drawing_box() {
		const drawing = this.settings.drawing;
		if (drawing === undefined)
			throw new Error(`drawing.box command must be called from animation.snapshotStyle.  It was called without a complete drawing.`);

		const boundingBox = drawing.getBoundingBox();
		const box = new Map([
			['minX', boundingBox.min.getX()],
			['minY', boundingBox.min.getY()],
			['minZ', boundingBox.min.getZ()],
			['maxX', boundingBox.max.getX()],
			['maxY', boundingBox.max.getY()],
			['maxZ', boundingBox.max.getZ()],
		]);
		return box;
	}
};