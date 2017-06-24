var convertKeycodeToFrequency = function(keyCode) {

	var notes = {
	  'c':  261.63,
	  'c-sharp':  277.18,
	  'd':  293.66,
	  'd-sharp':  311.13,
	  'e':  329.63,
	  'f':  349.23,
	  'f-sharp':  369.99,
	  'g':  392.00,
	  'g-sharp':  415.30,
	  'a':  440.00,
	  'a-sharp':  466.16,
	  'b':  493.88,
	  'c2':  523.25,
	}

	switch (keyCode) {
    case 65: return notes['c'];
    case 87: return notes['c-sharp'];
    case 83: return notes['d'];
    case 69: return notes['d-sharp'];
    case 68: return notes['e'];
    case 70: return notes['f'];
    case 84: return notes['f-sharp'];
    case 71: return notes['g'];
    case 89: return notes['g-sharp'];
    case 72: return notes['a'];
    case 85: return notes['a-sharp'];
    case 74: return notes['b'];
    case 75: return notes['c2']
    case 90: return '/';
    case 88: return '*';
    default: break;
	 }
}