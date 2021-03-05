import { Tree } from './Tree.js'

export function initTreeSettings(renderer) {
	var numBranches = document.getElementById('num-branches');
	var spread = document.getElementById('branch-spread');
	var scaleFactor = document.getElementById('branch-scale-ratio');
	var timer;
	
	function clearTimer() {
		if (timer !== undefined) {
			clearTimeout(timer);
			timer = undefined;
		}
	}

	function regenerateTree(minBranchLength) {
		if (typeof minBranchLength !== 'number') {
			minBranchLength = 0.03;
			clearTimer();
		}
		renderer.setTriangles(new Tree(
			parseInt(numBranches.value), 
			parseFloat(spread.value),
			parseFloat(scaleFactor.value),
			minBranchLength).getTriangles());
	}

	// Regenerates the tree quickly.
	// The smallest branches aren't generated 
	// for the sake of time and quick response.
	function rapidRegenerate() {
		clearTimer();
		regenerateTree(0.15);
		timer = setTimeout(regenerateTree, 1000);
	}

	spread.addEventListener('input', rapidRegenerate);
	numBranches.addEventListener('change', regenerateTree);
	scaleFactor.addEventListener('input', rapidRegenerate);
}