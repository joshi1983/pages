export class MeshFileFormatImporter {
	matches(filename) {
		if (typeof this.accept !== 'string')
			return false;
		filename = filename.toLowerCase();
		return filename.lastIndexOf(this.accept) === filename.length - this.accept.length;
	}
}