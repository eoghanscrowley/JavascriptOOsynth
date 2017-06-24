var Oscillator = function(options) {

	var ctx = options.ctx || new (window.AudioContext || window.webkitAudioContext)();
	
	var gain = ctx.createGain();
	gain.gain.value = 0;
	gain.connect(ctx.destination);


	var osc = ctx.createOscillator();
	osc.type = options.type || 'sine';
	osc.frequency.value = options.frequency || 440;
	osc.connect(gain);
	osc.start();

	this.ctx = ctx;
	this.osc = osc;
	this.frequency = osc.frequency.value;
	this.type = osc.type;
	this.detune = options.detune || 0;
	this.attack = options.attack || 0;
	this.decay = options.decay || 0;
	this.sustain = options.sustain || 1;
	this.release = options.release || 0;
	this.gain = gain;
	this.volume = options.volume || 0.7;
	this.playing = false;
	this.now = ctx.currentTime;
	this.octave = options.octave || 0.5;

}


Oscillator.prototype = {
	toQuadratic: function(value) {
		console.log('inside toQuadratic');
	  return value * value;
	},
	setNowTime: function() {
		console.log('inside setNowTime');
		this.now = this.ctx.currentTime;
		console.log('nowTime set', this.now);
	},
	setVolume: function(newValue) {
		console.log('inside setVolume');
		this.volume = this.toQuadratic(newValue);
	},
	setType: function(newType) {
		console.log('inside setType');
		this.osc.type = this.type = newType;
	},
	setDetune: function(newValue) {
		console.log('inside setDetune');
		this.osc.detune.value = this.detune = newValue;
	},
	setAttack: function(newValue) {
		console.log('inside setAttack');
		this.attack = Number(newValue);
	},
	setDecay: function(newValue) {
		console.log('inside setDecay');
		this.decay = Number(newValue);
	},
	setSustain: function(newValue) {
		console.log('inside setSustain');
		this.sustain = newValue;
	},
	setRelease: function(newValue) {
		console.log('inside setRelease');
		this.release = Number(newValue);
	},
	checkForOctaveChange: function(operation) {
		if (operation === '*') this.octave *= 2;
		if (operation === '/') this.octave /= 2;
	},
	setADSR: function(newOpts) {
		var newAttack = newOpts.attack || this.attack;
		var newDecay = newOpts.decay || this.decay;
		var newSustain = newOpts.sustain || this.sustain;
		var newRelease = newOpts.release || this.release;

		this.setAttack(newAttack);
		this.setDecay(newDecay);
		this.setSustain(newSustain);
		this.setRelease(newRelease);
	},
	setFrequency: function(newFrequency) {
		console.log('inside setFrequency')
		this.frequency = newFrequency * this.octave;
		this.osc.frequency.setValueAtTime(this.frequency, this.now);
		console.log('newFrequency', this.frequency);
	},
	handleReset: function() {
		console.log("inside handleReset");
		this.gain.gain.cancelScheduledValues(this.now);
		this.gain.gain.setValueAtTime(0, this.now);
	},
	handleAttack: function() {
		console.log("inside handleAttack");
		var endOfAttack = this.now + this.attack + 0.012;
		console.log('endOfAttack', endOfAttack);
		this.gain.gain.linearRampToValueAtTime(this.volume, endOfAttack);
	},
	handleDecay: function() {
		console.log("inside handleDecay");
		var sustainValue = this.volume * this.sustain;
		var endOfDecay = this.now + this.attack + this.decay + 0.012;
		console.log('endOfDecay', endOfDecay);
		this.gain.gain.linearRampToValueAtTime(sustainValue, endOfDecay);
	},
	handleRelease: function() {
		console.log('inside handleRelease')
		var endOfRelease = this.now + this.release + 0.012;
		this.gain.gain.linearRampToValueAtTime(0, endOfRelease);
	},
	stopAttack: function(timeSinceKeyDown) {
		console.log('inside stopAttack');
		var ratioDone = timeSinceKeyDown / this.attack;
		var gainValueAtInteruption = this.volume * ratioDone;
		this.gain.gain.cancelScheduledValues(this.now);
		this.gain.gain.setValueAtTime(gainValueAtInteruption, this.now);
	},
	stopDecay: function(timeSinceKeyDown) {
		console.log('inside stopDecay');
		var timeIntoDecay = (timeSinceKeyDown - this.attack);
		var ratioDone = timeIntoDecay / this.decay;
		var sustainVolume = this.volume * this.sustain;
		var totalAmountToDecay = this.volume - sustainVolume;
		var amountDecayedAtInteruption = totalAmountToDecay * ratioDone;
		var gainValueAtInteruption = this.volume - amountDecayedAtInteruption;
		this.gain.gain.cancelScheduledValues(this.now);
		this.gain.gain.setValueAtTime(gainValueAtInteruption, this.now);
	},
	handleADSRInteruption: function() {
		console.log('inside handleADSRInteruption');
		var timeOfKeyDown = this.now;
		this.setNowTime();
		var timeSinceKeyDown = this.now - timeOfKeyDown;
		console.log('timeSinceKeyDown', timeSinceKeyDown);
		if (timeSinceKeyDown < this.attack) {
			this.stopAttack(timeSinceKeyDown);
		} else if (timeSinceKeyDown < (this.attack + this.decay)) {
			this.stopDecay(timeSinceKeyDown);
		}
	},
	handleKeyDown: function(freq) {
		this.checkForOctaveChange(freq);
		if (!this.playing && typeof freq === 'number') {
			console.log("--------------------------------------------");
			console.log("NOTE PRESSED");
			console.log("--------------------------------------------");
			this.playing = true;
			this.setNowTime();
			this.setFrequency(freq);
			this.handleReset();
			this.handleAttack();
			this.handleDecay();
		}
	},
	handleKeyUp: function() {
		if (this.playing) {
			console.log("--------------------------------------------");
			console.log("NOTE RELEASED");
			console.log("--------------------------------------------");
			this.playing = false;
			this.handleADSRInteruption();
			this.handleRelease();
		}	
	}
}