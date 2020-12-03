"use strict"

/*
Written by Josh Greig around October 17, 2020.
*/

window.addEventListener("DOMContentLoaded", function() {
  let canvas = document.querySelector('#main-canvas');
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  let pid = gl.createProgram();
  var h = canvas.clientHeight;
  var w = canvas.clientWidth;
  loadShaders(gl, pid);
  let locationOfCentre = gl.getUniformLocation(pid, "centre");
  var realtimeRenderer = new RealtimeRenderer();
  var ambientLight = new AmbientLight(gl, pid, realtimeRenderer);
  var camera = new Camera(gl, pid);
  let pixelStretch = 3;
  // start fairly low quality to safely know we won't crash the browser to start with.

  var positionY = 0;

	initCoords(gl, pid);
  var scale = new Scale(gl, pid);
  var lineThicknessFactor = 0.001;
  var times = [];
  var lightDirection = new LightDirection(gl, pid, realtimeRenderer);

	// This is important for managing browser view zoom.
	// A zoom other than 100% causes canvas.clientWidth != viewport width.
	function getViewportDimensions() {
		var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);	
		return [vw, vh];
	}
	
	function getWidth() {
		return w;
	}
	
	function getHeight() {
		return h;
	}

 var displayMode = new DisplayMode(gl, pid, realtimeRenderer);
 var planeCutValue = new PlaneCutValue(gl, pid, realtimeRenderer);
  var circles = new Circles(gl, pid, camera, getWidth, getHeight, realtimeRenderer);
  var sphereRadius = new SphereRadius(gl, pid, planeCutValue, scale, 
	circles, getWidth, getHeight, realtimeRenderer);
	circles.setSphereRadius(sphereRadius);
  var cRealValue = new CRealValue(gl, pid, realtimeRenderer);
  var planeCutAxis = new PlaneCutAxis(gl, pid, realtimeRenderer);
  var mandelBrotDisplay = new MandelbrotDisplay(gl, pid, pixelStretch, sphereRadius, displayMode,
	planeCutValue, cRealValue, planeCutAxis, scale, circles, getViewportDimensions, 
	getCentre);
  planeCutAxis.setMandelBrotDisplay(mandelBrotDisplay);
  cRealValue.setMandelBrotDisplay(mandelBrotDisplay);
  planeCutValue.setMandelBrotDisplay(mandelBrotDisplay);
  var maxIterations = new MaxIterations(gl, pid, mandelBrotDisplay, realtimeRenderer);
  resized();
  var peakOpacity = new PeakOpacity();
  var sampleOpacity = new SampleOpacity(gl, pid, peakOpacity, realtimeRenderer);
  var lightObstructionDeltaRatio = new LightObstructionDelta(gl, pid, sampleOpacity, peakOpacity, realtimeRenderer);
  peakOpacity.setLightObstructionDeltaRatio(lightObstructionDeltaRatio);
  var pixelSubsampling = new PixelSubsampling(gl, pid);
  displayMode.initSettingsToggler(mandelBrotDisplay, pixelSubsampling);
  var downloader = new DownloadRenderer(gl, pid, mandelBrotDisplay, pixelSubsampling, sphereRadius, displayMode, scale,
	peakOpacity, circles, realtimeRenderer);
	sphereRadius._updated();
  var renderSettings = new RenderSettings(ambientLight, camera, circles, cRealValue, displayMode, 
	lightDirection, maxIterations, peakOpacity, planeCutAxis, planeCutValue, scale, sphereRadius);
  var benchmarker = new Benchmarker(renderSettings, downloader);
  var animation = new AnimationUI(renderSettings, downloader, realtimeRenderer);
	
	// returns value to be used in shader's uniform.
	// In other words, this isn't returning pixel coordinates.
	// You need the multiply the values by pixelStretch to get the pixel coordinates.
	function getCentre() {
	  var cy = h / 2;
	  var body = document.querySelector('body');
	  var bodyClass = body.class;
	  if (!bodyClass)
		bodyClass = '';

	  // if the settings are showing and it is more than 0.3 * h,
	  // look for a better cy.
	  if (bodyClass.indexOf('settings-collapsed') === -1 && sphereRadius !== undefined) {
		  var settings = document.getElementById('settings');
		  var settingsHeight = settings.clientHeight / pixelStretch;
		  if (settingsHeight > 0.3 * h) {
			  	var r = sphereRadius.get();
				if (r < 0.9 * camera.rotationRadius && r < 0.5 * h) {
					r = circles.getRadiusFromSphereRadius(r, scale.get());
					var remainingHeight = h - settingsHeight;
					if (remainingHeight > r * 2) {
						cy = remainingHeight / 2;
					}
				}
		  }
	  }
	  return [w / 2, cy];
	}

  function updateCentre() {
	  var newCentre = getCentre();
	  gl.uniform2fv(locationOfCentre, newCentre);
	  mandelBrotDisplay.updateVisibility();
  }
  
  function refreshPixelStretchCentreAndScale() {
	  w = window.innerWidth;
	  h = window.innerHeight;
	  
	  w /= pixelStretch;
	  h /= pixelStretch;
	  updateCentre();
	  
	  canvas.setAttribute('width', Math.round(w));
	  canvas.setAttribute('height', Math.round(h));
	  scale.set(scale.getScaleFromDimensions(w, h));
  }
  
  function resized() {
	  refreshPixelStretchCentreAndScale();
	  mandelBrotDisplay.updateSize();
	  realtimeRenderer.redraw();
  }
  
  function decreaseQuality(currentFrameRate) {
	  if (displayMode.isPlaneCut()) {
		if (pixelStretch === 1)
			pixelSubsampling.decreaseQuality();
		else
			pixelSubsampling.useLowestQuality();
	  }
	  if (pixelStretch === 1 && !displayMode.isPlaneCut() && !lightObstructionDeltaRatio.isLowest1PixelStretchQuality()) {
		  
		lightObstructionDeltaRatio.decreaseQuality();
		
		// If the frame rate is terrible, increase pixelStretch immediately.
		if (currentFrameRate < 5) {
				pixelStretch++;
				refreshPixelStretchCentreAndScale();
		}
		else {
			pixelStretch++;
			refreshPixelStretchCentreAndScale();
		}
	  }
	  else {
		pixelStretch++;
		refreshPixelStretchCentreAndScale();
	  }
  }
  displayMode.decreaseQuality = decreaseQuality;

  function increaseQuality(currentFrameRate) {
	  if (pixelStretch > 1) {
			pixelStretch--;
			refreshPixelStretchCentreAndScale();
	  }
	  else if (!displayMode.isPlaneCut()) {
		  lightObstructionDeltaRatio.increaseQuality();
	  }
	  else {
		  if (currentFrameRate > 55) {
			pixelSubsampling.increaseQuality();
		  }
	  }
  }

  function improveFrameRateInResponseTo(currentFrameRate) {
	  if (currentFrameRate < 20) {
		  decreaseQuality(currentFrameRate);
	  }
	  else if (currentFrameRate > 50) {
		  increaseQuality(currentFrameRate);
	  }
  }

  function draw() {
		circles.updateCircleRadiusRange(gl, w, h, scale.get(), circles.locationOfCircleRadiusRange);
		camera.changed();
		drawGraphics(gl, w, h);
  }

  function processDrag(dx, dy) {
	camera.addAngleAndRadius(dx * 0.002, dy * 0.004);
	mandelBrotDisplay.updateVisibility();
	realtimeRenderer.redraw();
  }

  function initSettings() {
	var body = document.querySelector('body');
	var settingsCloseButton = document.getElementById('collapse-settings-button');
	var settingsExpandButton = document.getElementById('expand-settings-button');

	  function settingsClose() {
		  body.setAttribute('class', 'settings-collapsed');
	  }
	  
	  function settingsExpand() {
		  body.setAttribute('class', '');
	  }

	settingsCloseButton.addEventListener('click', settingsClose);
	settingsExpandButton.addEventListener('click', settingsExpand);
  }

  initSettings();
  new MouseTouchUtils(canvas, processDrag);
  window.addEventListener('resize', resized);
  resized();
  mandelBrotDisplay.updateSize();
  realtimeRenderer.init(benchmarker, draw, downloader, animation);
});