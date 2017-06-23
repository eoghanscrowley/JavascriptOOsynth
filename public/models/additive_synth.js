var AdditiveSynth = function(options) {

  var ctx = options.ctx || new (window.AudioContext || window.webkitAudioContext)();

  var osc1 = new Oscillator(options.osc1);
  var osc2 = new Oscillator(options.osc1);

  var gain = new Gain(options.gain);

  osc1.connect(gain.gain);
  osc2.connect(gain.gain);

  this.os1 = osc1;
  this.osc2 = osc2;
  this.gain = gain;
}

AdditiveSynth.prototype = {
  setGain: function(newValue) {
    this.gain.setValue(newValue);
  }
};