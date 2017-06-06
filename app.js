// ================================================================== //
// This is the base of the shadow shroud project. It runs a NodeJS    //
// backend that listens for input, and plays selected MP3's upon      //
// a button trigger. It will also modulate LED's.                     //
// ================================================================== //
console.log("[INFO] Starting Shadow-Shroud (app.js)");
console.log("[INFO] Arguements passed to app.js:");
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
///////////////////////////Libraries////////////////////////////////////
var Gpio = require('pigpio').Gpio;
// var fs = require("fs");
// var lame = require("lame");
// var Speaker = require("speaker");
// var player = require("player");

////////////////////////Pin Assignments/////////////////////////////////
// change these to match your LED GPIO pins :
var ledPins = [14,15,18,17,27,22,25,8,7];
var btnPins = [2,3,4];

///////////////////////Global Variables/////////////////////////////////
var leds = [];
var btns = [];
var globalState = 0;

///////////////////////////initialize///////////////////////////////////
for (var i = 0; i<ledPins.length; i++) {
 var led = new Gpio(ledPins[i], {mode: Gpio.OUTPUT});
 leds.push(led);
} //Output pins

for (var i = 0; i<btnPins.length; i++) {
 var btn = new Gpio(btnPins[i], {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  });
 btns.push(btn);
} //Input pins
////////////////////////////////////////////////////////////////////////////////
// There are going to be 5ish states.
// State 1: Wait => Lights fade green blue, maybe purple. "Cool/Slow"
// State 2: Button 1 => Inspire. Lights fade through a few cooler to warmer colors
// State 3: Button 2 => Intrigue. Fast paced, warm colors. One song.
// State 4: Button 3 => Party! Fast paced, strobing, 3 songs.
// State 5: Acknowledge => pulse of bright white light that fades on button press
////////////////////////////////////////////////////////////////////////////////

function acknowledgeButtonPress(){
  //button has been pressed so:
  //briefly (1s bright, 3 sec fade)
    //turn all led's white
    //fade out to black
}

setInterval(waitForInput, 16); //run every 16ms
function waitForInput(){
  //this whole function might be on setInterval. running repteadly waiting.
  //when button state is nothing/0
    //pulse green to blue with some purple
  //When button press/interrupt detected
    //set global button state variable
    btns[0].on('interrupt', function (level??) {
      acknowledgeButtonPress();
      inspire();
    });
    btns[1].on('interrupt', function (level) {
      acknowledgeButtonPress();
      inspire();
    });
    btns[2].on('interrupt', function (level) {
      acknowledgeButtonPress();
      inspire();
    });
}


function inspire(){
  //play intro MP3
  //play inspirational MP3
  //change led's to cool/slow as it is going
  //return to wait state
}

function intrigue(){
  //play solo 'intrigue show me what you got'
  //play one song
  //return to wait state
}

function danceParty(){
  //play solo 'dance party clip'
  //pick 3 songs from list at random
  //play songs
  //that stuff is async so
  //dance party LED's
  //return to wait state
}
