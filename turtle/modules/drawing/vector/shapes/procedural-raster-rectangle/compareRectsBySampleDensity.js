function getSampleDensity(rect) {
	return rect.sampleWidth * rect.sampleHeight / (rect.widthRatio * rect.heightRatio);
}

/*
Used to determine drawing order on canvases.
*/
export function compareRectsBySampleDensity(rect1, rect2) {
	return getSampleDensity(rect1) - getSampleDensity(rect2);
};