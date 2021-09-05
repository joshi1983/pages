let snapshotProgressContainer;
let snapshotProgressElement;
let snapshotSpan;
let snapshotsPerFrame;
let lastFrameChangeTime;
let lastTimeBetweenFrames;
let isVisible;
const maxProgressUpdateTimeInterval = 3000;

class PrivateSnapshotProgress {
	findElements() {
		snapshotProgressContainer = document.getElementById('snapshot-container');
		snapshotProgressElement = document.getElementById('snapshot-progress');
		snapshotSpan = document.getElementById('snapshot-span');
		lastFrameChangeTime = undefined;
		lastTimeBetweenFrames = undefined;
		isVisible = false;
	}

	downloadStarted(snapshotsPerFrame_) {
		snapshotProgressElement.max = snapshotsPerFrame_ - 1;
		snapshotsPerFrame = snapshotsPerFrame_;
		this.frameChanged();
	}

	frameChanged() {
		if (lastFrameChangeTime !== undefined)
			lastTimeBetweenFrames = Date.now() - lastFrameChangeTime;
		lastFrameChangeTime = Date.now();
		if (isVisible)
			this.update(0, snapshotsPerFrame);
	}

	update(snapshotIndex) {
		this.updateVisibility();
		if (isVisible) {
			snapshotSpan.innerText = `${snapshotIndex} of ${snapshotsPerFrame}`;
			snapshotProgressElement.value = snapshotIndex;
		}
	}

	updateVisibility() {
		const now = Date.now();
		const newIsVisible = snapshotsPerFrame > 1 && (
		(lastFrameChangeTime !== undefined && now - lastFrameChangeTime > maxProgressUpdateTimeInterval) ||
		(lastTimeBetweenFrames !== undefined && lastTimeBetweenFrames > maxProgressUpdateTimeInterval)
		);
		if (isVisible !== newIsVisible) {
			isVisible = newIsVisible;
			if (isVisible)
				snapshotProgressContainer.classList.remove('hidden');
			else
				snapshotProgressContainer.classList.add('hidden');
		}
	}
}

const SnapshotProgress = new PrivateSnapshotProgress();

export { SnapshotProgress };