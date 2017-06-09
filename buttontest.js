const Gpio = require('pigpio').Gpio;
////////////////////////Pin Assignments/////////////////////////////////
// change these to match your LED GPIO pins :
var ledPins = [14,15,18,   17,27,22,   25,8,7]; //full set
var redPins = [14,17,25];
var grnPins = [15,27,8];
var bluPins = [18,22,7];
//buttons
var btnPins = [2,3,4];

///////////////////////Global Variables/////////////////////////////////
var leds = [];
var btns = [];
// Empty arrays to hold gpio objects
var reds = [];
var grns = [];
var blus = [];

var globalState = 0;

for (var i = 0; i<btnPins.length; i++) {
 var btn = new Gpio(btnPins[i], {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.RISING_EDGE,
    alert: true
  });
 btns.push(btn);
}

btns[0].on('alert', function () {
console.log("Button 1 Pressed");
});

// btns[1].on('alert', function () {
// console.log("Button 2 Pressed");
// });
//
// btns[2].on('alert', function () {
// console.log("Button 3 Pressed");
// });
