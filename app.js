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
const Gpio = require('pigpio').Gpio;
const _ = require('lodash');
const sleep = require('sleep'); //debugging
// var fs = require("fs");
// var lame = require("lame");
// var Speaker = require("speaker");
// var player = require("player");
// const StreamPlayer = require('streamplayer');
// var Omx = require('node-omxplayer');

// var songs = require("./songs.js"); //songs.js creates song objects and lists
// songs.songNames[0]= "whatever that is"

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
//Input pins for 3 large red arcade buttons. Buttons changed to pullup because I2C bus has 1.8k pullups on
//by default. being experimented on 6/10
for (var i = 0; i<btnPins.length; i++) {
 var btn = new Gpio(btnPins[i], {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.RISING_EDGE,
    alert: true
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
  sleep.sleep(2);
  //maybe check if I can do 'on' during button press and 'fade away' on falling edge

  //button has been pressed so:
  //briefly (1s bright, 3 sec fade)
    //turn all led's white
    //fade out to black
}

function inspire(){
  console.log("Inspire function triggered");
  //
  // timer = 0;
  // timermax = 2000;
  // setInterval( function(){
  //   while (timer<timermax){
      for(var i = 0; i<reds.length; i++) { reds[i].pwmWrite(0); }
      for(var i = 0; i<grns.length; i++) { grns[i].pwmWrite(0); }
      for(var i = 0; i<blus.length; i++) { blus[i].pwmWrite(255); }
      console.log("Waiting 5sec on blue");
      sleep.sleep(5);
  //     timer+=16;
  //   }
  //
  // }
  // ,16);

  //play intro MP3
  //play inspirational MP3
  //change led's to cool/slow as it is going
  //return to wait state
}

function intrigue(){
  console.log("intrigue function triggered");
  //
  // timer = 0;
  // timermax = 2000;
  // setInterval( function(){
  //   while (timer<timermax){
      for(var i = 0; i<reds.length; i++) { reds[i].pwmWrite(200); }
      for(var i = 0; i<grns.length; i++) { grns[i].pwmWrite(100); }
      for(var i = 0; i<blus.length; i++) { blus[i].pwmWrite(75); }
      console.log("Waiting 5sec on whatever intriguing color");
      sleep.sleep(5);
  //     timer+=16;
  //   }
  //
  // }
  // ,16);

  //play solo 'intrigue show me what you got'
  //play one song
  //return to wait state
}

function danceParty(){
  console.log("danceParty function triggered");
  // timer = 0;
  // timermax = 2000;
  // var stopParty = setInterval( function(){

      for(var i = 0; i<reds.length; i++) { reds[i].pwmWrite(255); }
      for(var i = 0; i<grns.length; i++) { grns[i].pwmWrite(0);   }
      for(var i = 0; i<blus.length; i++) { blus[i].pwmWrite(100); }
      console.log("Waiting 5sec on purplish");
      sleep.sleep(5);
  //     timer+=16;
  //     console.log("timer value (danceparty) is: "+timer);
  // }
  // ,16);
  // if(timer>2000){
  //   console.log("since we're done with the dance party, clearInterval on danceParty");
  //   clearInterval(stopParty);
  // }
  //play solo 'dance party clip'
  //pick 3 songs from list at random
  //play songs
  //that stuff is async so
  //dance party LED's
  //return to wait state
}

waitForInput(); //cycle through wait time indefinitely

////////////////////////////Button Interrupt checking///////////////////////////
//check globalState to see if in function or not
btns[0].on('interrupt', _.debounce(function () { //IF BUTTON 1 IS HIT-----------

  switch(globalState) { //start switch case
      case 0: //IF BUTTON 1 PRESSED IN WAIT MODE
          globalState=1; //If in wait mode, set state to 1 (intro)
          acknowledgeButtonPress(1); //Flash to Acknowledge state change
          btns[1].disableInterrupt(); // Stop events emitted from button 2
          btns[2].disableInterrupt(); // Stop events emitted from button 3
          inspire(); //go to state 1
          break;
      case 1: //IF BUTTON 1 PRESSED IN STATE 1 (INTRO)
          globalState=0; //If in button 1, return to wait mode 0
          acknowledgeButtonPress(1);
          btns[1].enableInterrupt(); // Start events emitted from button 2
          btns[2].enableInterrupt(); // Start events emitted from button 3
          waitForInput();
          break;
      default:
          console.log("Fail on button press 1");
  }
}),100);//end switch case for BUTTON 1. Debounced 100ms-------------------------

btns[1].on('interrupt', _.debounce(function () { //IF BUTTON 2 IS HIT----------------------

  switch(globalState) { //start switch case
      case 0: //IF BUTTON 2 PRESSED IN WAIT MODE
          globalState=2; //If in wait mode, set state to 1 (intro)
          acknowledgeButtonPress(2); //Flash to Acknowledge state change
          btns[0].disableInterrupt(); // Stop events emitted from button 2
          btns[2].disableInterrupt(); // Stop events emitted from button 3
          intrigue(); //go to state 1
          break;
      case 2: //IF BUTTON 2 PRESSED IN STATE 2 (Intrigue)
          globalState=0; //If in button 1, return to wait mode 0
          acknowledgeButtonPress(2);
          btns[0].enableInterrupt(); // Start events emitted from button 2
          btns[2].enableInterrupt(); // Start events emitted from button 3
          waitForInput();
          break;
      default:
          console.log("Fail on button press 2");
  }
}),100);//end switch case for BUTTON 2-----------------------------------------------

btns[2].on('interrupt', _.debounce(function () { //IF BUTTON 3 IS HIT-------------------------

  switch(globalState) { //start switch case
      case 0: //IF BUTTON 3 PRESSED IN WAIT MODE
          globalState=3; //If in wait mode, set state to 1 (intro)
          acknowledgeButtonPress(3); //Flash to Acknowledge state change
          btns[0].disableInterrupt(); // Stop events emitted from button 2
          btns[1].disableInterrupt(); // Stop events emitted from button 3
          danceParty(); //go to state 1
          break;
      case 3: //IF BUTTON 3 PRESSED IN STATE 3 (danceParty)
          globalState=0; //If in button 1, return to wait mode 0
          acknowledgeButtonPress(3);
          btns[0].enableInterrupt(); // Start events emitted from button 2
          btns[1].enableInterrupt(); // Start events emitted from button 3
          waitForInput();
          break;
      default:
          console.log("Fail on button press 3");
  }
}),100);//end switch case for BUTTON 3-----------------------------------------------
