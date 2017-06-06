var Gpio = require('pigpio').Gpio;
// change these to match your LED GPIO pins :
var ledPins = [14,15,18,17,27,22,25,8,7];
var leds = [];
// initialise all the pins
for (var i = 0; i<ledPins.length; i++) {
	var led = new Gpio(ledPins[i], {mode: Gpio.OUTPUT});
	leds.push(led);
}
// get a loop running 60 times a second (1000/60 = 16.6)
setInterval(loop, 16);
function loop() {
	for(var i = 0; i<leds.length; i++) {
		var led = leds[i];
		// calculate a sin wave for brightness dependent on time and
		// position in the row of LEDs
		var brightness = Math.sin(((Date.now()/16)+(i*5))*0.2)*0.5 + 0.5;
		// a quick way to do a cubic ease in - it means the LEDs get brighter
		// slower. It compensates for the fact that LEDs get bright quick.
		brightness*=brightness*brightness;
		// the pigpio library complains if you send it a floating point number
		// so we have to round it down.
		brightness = Math.floor(brightness*255);
		led.pwmWrite(brightness);
	}

}
