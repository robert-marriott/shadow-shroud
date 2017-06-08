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

///////////////////////////initialize///////////////////////////////////
//All output LED pins as one array.
for (var i = 0; i<ledPins.length; i++) {
 var led = new Gpio(ledPins[i], {mode: Gpio.OUTPUT});
 leds.push(led);
}
// LED channels sorted into R G and B
for (var i = 0; i<redPins.length; i++) { var led = new Gpio(redPins[i], {mode: Gpio.OUTPUT}); reds.push(led) }
for (var i = 0; i<grnPins.length; i++) { var led = new Gpio(grnPins[i], {mode: Gpio.OUTPUT}); grns.push(led) }
for (var i = 0; i<bluPins.length; i++) { var led = new Gpio(bluPins[i], {mode: Gpio.OUTPUT}); blus.push(led) }
//Input pins for 3 large red arcade buttons
for (var i = 0; i<btnPins.length; i++) {
 var btn = new Gpio(btnPins[i], {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.RISING_EDGE
  });
 btns.push(btn);
}


////////////////////////////////////////////////////////////////////////////////
// There are going to be 5ish states.
// State 1: Wait => Lights fade green blue, maybe purple. "Cool/Slow"
// State 2: Button 1 => Inspire. Lights fade through a few cooler to warmer colors
// State 3: Button 2 => Intrigue. Fast paced, warm colors. One song.
// State 4: Button 3 => Party! Fast paced, strobing, 3 songs.
// State 5: Acknowledge => pulse of bright white light that fades on button press
////////////////////////////////////////////////////////////////////////////////

////////////////////////////Button Interrupt checking///////////////////////////
btns[0].on('interrupt', function () {
  acknowledgeButtonPress(1);
  setTimeout(   inspire(),2*10)      ;
});
btns[1].on('interrupt', function () {
  acknowledgeButtonPress(2);
  setTimeout(   intrigue(),2*10)     ;
});
btns[2].on('interrupt', function () {
  acknowledgeButtonPress(3);
  setTimeout(   danceParty(),2*10)   ;
});

///////////////////////////////////Main Methods/////////////////////////////////
//setInterval(waitForInput, 16); //run every 16ms
function waitForInput(){
  for(var i = 0; i<reds.length; i++) { reds[i].pwmWrite(0); }
  for(var i = 0; i<grns.length; i++) { grns[i].pwmWrite(255); }
  for(var i = 0; i<blus.length; i++) { blus[i].pwmWrite(0); }
  //this whole function might be on setInterval. running repteadly waiting.
  //when button state is nothing/0
    //pulse green to blue with some purple
  //When button press/interrupt detected
    //set global button state variable
}

function acknowledgeButtonPress(btn){
  console.log("Button: "+btn+" press acknowledged");
  for(var i = 0; i<leds.length; i++) { leds[i].pwmWrite(255); }
  //maybe check if I can do 'on' during button press and 'fade away' on falling edge

  //button has been pressed so:
  //briefly (1s bright, 3 sec fade)
    //turn all led's white
    //fade out to black
}

function inspire(){
  console.log("Inspire function triggered");

  timer = 0;
  timermax = 2000;
  setInterval( function(){
    while (timer<timermax){
      for(var i = 0; i<reds.length; i++) { reds[i].pwmWrite(0); }
      for(var i = 0; i<grns.length; i++) { grns[i].pwmWrite(0); }
      for(var i = 0; i<blus.length; i++) { blus[i].pwmWrite(255); }
    }
    timer+=16;
  }
  ,16);

  //play intro MP3
  //play inspirational MP3
  //change led's to cool/slow as it is going
  //return to wait state
}

function intrigue(){
  console.log("intrigue function triggered");

  timer = 0;
  timermax = 2000;
  setInterval( function(){
    while (timer<timermax){
      for(var i = 0; i<reds.length; i++) { reds[i].pwmWrite(200); }
      for(var i = 0; i<grns.length; i++) { grns[i].pwmWrite(100); }
      for(var i = 0; i<blus.length; i++) { blus[i].pwmWrite(75); }
    }
    timer+=16;
  }
  ,16);

  //play solo 'intrigue show me what you got'
  //play one song
  //return to wait state
}

function danceParty(){
  console.log("danceParty function triggered");
  timer = 0;
  timermax = 2000;
  setInterval( function(){
    while (timer<timermax){
      for(var i = 0; i<reds.length; i++) { reds[i].pwmWrite(255); }
      for(var i = 0; i<grns.length; i++) { grns[i].pwmWrite(0); }
      for(var i = 0; i<blus.length; i++) { blus[i].pwmWrite(100); }
    }
    timer+=16;
  }
  ,16);
  //play solo 'dance party clip'
  //pick 3 songs from list at random
  //play songs
  //that stuff is async so
  //dance party LED's
  //return to wait state
}

setInterval(waitForInput,16); //cycle through wait time indefinitely
