var oscillator;
var oscillator2;
var allOscillators = [];


var handleKeyDown = function(event) {
	var freq = convertKeycodeToFrequency(event.which);
	for (var oscillator of allOscillators) {
		oscillator.handleKeyDown(freq);
	}	
}
var handleKeyUp = function() {
	for (var oscillator of allOscillators) {
		oscillator.handleKeyUp();	
	}
}

var attachOscillatorToUI = function(idOfUI, oscillator) {
	var handleVolumeChange = function() { oscillator.setVolume(this.value); }
	var handleTypeChange = function() { oscillator.setType(this.value); }
	var handleAttackChange = function() { oscillator.setAttack(this.value); }
	var handleDecayChange = function() { oscillator.setDecay(this.value); }
	var handleSustainChange = function() { oscillator.setSustain(this.value); }
	var handleReleaseChange = function() { oscillator.setRelease(this.value); }
	var handleDetuneChange = function() { oscillator.setDetune(this.value); }
	var idOfUIwithHash = "#" + idOfUI;
	var waveSelect = document.querySelector(idOfUIwithHash + ' .wave-select');
	waveSelect.value = oscillator.type;
	var attackControls = document.querySelector(idOfUIwithHash + ' .attack');
	attackControls.value = oscillator.attack;
	var decayControls = document.querySelector(idOfUIwithHash + ' .decay');
	decayControls.value = oscillator.decay;
	var sustainControls = document.querySelector(idOfUIwithHash + ' .sustain');
	sustainControls.value = oscillator.sustain;
	var releaseControls = document.querySelector(idOfUIwithHash + ' .release');
	releaseControls.value = oscillator.release;
	var detuneControls = document.querySelector(idOfUIwithHash + ' .detune-slide');
	detuneControls.value = oscillator.detune;
	var volumeControls = document.querySelector(idOfUIwithHash + ' .volume');
	volumeControls.value = oscillator.volume;
	waveSelect.addEventListener('change', handleTypeChange);
	attackControls.addEventListener('change', handleAttackChange);
	decayControls.addEventListener('change', handleDecayChange);
	sustainControls.addEventListener('change', handleSustainChange);
	releaseControls.addEventListener('change', handleReleaseChange);
	detuneControls.addEventListener('change', handleDetuneChange);
	volumeControls.addEventListener('change', handleVolumeChange);
	
}

var createBanner = function() {
	var banner = document.createElement('div');
	banner.classList.add('banner');
	var h1 = document.createElement('h1');
	h1.innerHTML = "Oscillator";
	var button1 = document.createElement('button');
	button1.innerHTML = "X";
	var button2 = document.createElement('button');
	button2.innerHTML = "|";

	banner.appendChild(h1);
	banner.appendChild(button1);
	banner.appendChild(button2);
	return banner;
}

var createOption = function(value) {
	var option = document.createElement('option');
	option.value = value;
	option.innerHTML = value.toUpperCase();
	return option;
}

var createSelect = function() {
	var select = document.createElement('select');
	select.classList.add('wave-select');
	var sine = createOption('sine');
	var square = createOption('square');
	var sawtooth = createOption('sawtooth');
	var triangle = createOption('triangle');

	select.appendChild(sine);
	select.appendChild(square);
	select.appendChild(sawtooth);
	select.appendChild(triangle);
	return select;
}

var createWaveType = function() {
	var waveType = document.createElement('div');
	waveType.classList.add('wave-type');
	var h3 = document.createElement('h3');
	h3.innerHTML = "Wave Type";
	var select = createSelect();

	waveType.appendChild(h3);
	waveType.appendChild(select);
	return waveType;
}

var createLabels = function() {
	var labels = document.createElement('div');
	labels.classList.add('labels');
	var span1 = document.createElement('span');
	span1.innerHTML = "A";
	var span2 = document.createElement('span');
	span2.innerHTML = "D";
	var span3 = document.createElement('span');
	span3.innerHTML = "S";
	var span4 = document.createElement('span');
	span4.innerHTML = "R";

	labels.appendChild(span1);
	labels.appendChild(span2);
	labels.appendChild(span3);
	labels.appendChild(span4);
	return labels;
}

var createInput = function(className, type, max, min, step, value) {
	var input = document.createElement('input');
	input.classList.add(className);
	input.type = type;
	input.setAttribute('max', max);
	input.setAttribute('min', min);
	input.setAttribute('step', step); 
	input.value = value;
	return input;
}

var createSlidersContainer = function() {
	var slidersContainer = document.createElement('div');
	slidersContainer.classList.add('sliders-container');
	var input1 = createInput("attack", "range", 6, 0, 0.12, 0);
	var input2 = createInput("decay", "range", 6, 0, 0.12, 0);
	var input3 = createInput("sustain", "range", 1, 0, 0.01, 1);
	var input4 = createInput("release", "range", 6, 0, 0.12, 0);

	slidersContainer.appendChild(input1);
	slidersContainer.appendChild(input2);
	slidersContainer.appendChild(input3);
	slidersContainer.appendChild(input4);
	return slidersContainer;
}

var createADSR = function() {
	var adsr = document.createElement('div');
	adsr.classList.add('adsr');
	var labels = createLabels();
	var slidersContainer = createSlidersContainer();

	adsr.appendChild(labels);
	adsr.appendChild(slidersContainer);
	return adsr;
}

var createDetune = function() {
	var detune = document.createElement('div');
	detune.classList.add('detune');
	var h3 = document.createElement('h3');
	h3.innerHTML = "Detune";
	var slidersContainer = document.createElement('div');
	slidersContainer.classList.add('slider-container');
	var input = createInput("detune-slide", "range", 100, -100, 1, 0);
	slidersContainer.appendChild(input);

	detune.appendChild(h3);
	detune.appendChild(slidersContainer);
	return detune;
}

var createIO = function() {
	var io = document.createElement('div');
	io.classList.add('io');
	var h3 = document.createElement('h3');
	h3.innerHTML = "IO";
	var slidersContainer = document.createElement('div');
	slidersContainer.classList.add('sliders-container');
	var input = createInput("volume", "range", 1, 0, 0.01, 0.7);
	slidersContainer.appendChild(input);

	io.appendChild(h3);
	io.appendChild(slidersContainer);
	return io;
}

var createControls = function() {
	var controls = document.createElement('div');
	controls.classList.add('controls')
	var waveType = createWaveType();
	var adsr = createADSR();
	var detune = createDetune();
	var io = createIO();

	controls.appendChild(waveType);
	controls.appendChild(adsr);
	controls.appendChild(detune);
	controls.appendChild(io);
	return controls;
}

var SynthUIFactory = (function() {
	var count = 0;

	var createUI = function() {
		var synthNum = ++count;
		var synthContainer = document.createElement('div');
		synthContainer.id = "synth-" + synthNum;
		synthContainer.classList.add('synth-container');
		var banner = createBanner();
		var controls = createControls();

		synthContainer.appendChild(banner);
		synthContainer.appendChild(controls);
		return synthContainer;
	}

	return {
		createUI: createUI
	}

})();

var createOscillatorWithUI = function(options) {
	var oscillator = new Oscillator(options);
	var oscUI = SynthUIFactory.createUI();
	document.body.appendChild(oscUI);
	attachOscillatorToUI(oscUI.id, oscillator);
	allOscillators.push(oscillator);
	return oscillator;
}

var setUpSynths = function(presets, ctx) {
	for (var options of presets) {
		options.ctx = ctx
		createOscillatorWithUI(options);
	}
}

var handleSave = function() {
	console.log('inside handleSave');
	var oscillatorSave = allOscillators.map(function(oscillator) {
		var options = {
			type: oscillator.type,
			detune: oscillator.detune,
			attack: oscillator.attack,
			decay: oscillator.decay,
			sustain: oscillator.sustain,
			release: oscillator.release,
			volume: oscillator.volume,
			octave: oscillator.octave
		}
		return options;
	});
	console.log(oscillatorSave);
	var jsonString = JSON.stringify(oscillatorSave);
	localStorage.setItem('presets', jsonString);
}


var app = function() {
	var ctx = new (window.AudioContext || window.webkitAudioContext)();
	// var presets = [{}, {}];
	var jsonString = localStorage.getItem('presets');
	var presets = JSON.parse(jsonString);
	if (!presets) presets = [{}, {}, {}, {}];
	setUpSynths(presets, ctx);

	var saveButton = document.getElementById('save');
	saveButton.addEventListener('click', handleSave);
	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);
}

window.addEventListener('load', app);