// ================================================================== //
// This is the base of the shadow shroud project. It runs a NodeJS    //
// backend that listens for input, and plays selected MP3's upon      //
// a button trigger. It will also modulate LED's.                     //
// ================================================================== //
console.log("[INFO] Starting Shadow-Shroud (app.js)");

// Import necessary libraries.
var Gpio = require('pigpio').Gpio;

// change these to match your LED GPIO pins :
var ledPins = [14,15,18,17,27,22,25,8,7];
var butPins = [2,3,4];

// Initialize empty array to push new gpio objects to
var leds = [];
var buts = [];

// initialise all the output pins
for (var i = 0; i<ledPins.length; i++) {
 var led = new Gpio(ledPins[i], {mode: Gpio.OUTPUT});
 leds.push(led);
}

// initialise all the input button pins
for (var i = 0; i<butPins.length; i++) { 
 var but = new Gpio(butPins[i], {mode: Gpio.INPUT});
 buts.push(but);
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
