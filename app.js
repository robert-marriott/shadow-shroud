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
// var lame = require("lame");
// var Speaker = require("speaker");
// var player = require("player");
// const StreamPlayer = require('streamplayer');
// var Omx = require('node-omxplayer');

var colors = require("./colors.js");
// var songs = require("./songs.js"); //songs.js creates song objects and lists

////////////////////////Pin Assignments/////////////////////////////////
// change these to match your LED GPIO pins :
var ledPins = [14,15,18,   17,27,22,   25,8,7]; //full set. BCM values.
var channel1Pins = [14,15,18];
var channel2Pins = [17,27,22];
var channel3Pins = [25,8,7];
//buttons
var btnPins = [2,3,4];
///////////////////////Global Variables/////////////////////////////////
var leds = [];
var btns = [];
// Empty arrays to hold gpio objects
var channel1 = [];
var channel2 = [];
var channel3 = [];

//Timers
var globalTimer = Date.now();
var currentTime = 0;
var previousTime = 0;
var loopTime = 0;
//Global State
var globalState = 0;

//logarithmic lookup tables for linear brightness response LED fading.
var acknowledgeArray = [255,255,255,255,255,255,255,255,255,255,255,
                        255,255,255,255,255,235,216,197,196,180,163,
                        148,134,120,108,96,86,76,67,58,51,44,38,35,
                        32,27,22,18,15,12,9,7,5,4,3,2,1,0,0];
///////////////////////////initialize///////////////////////////////////
//All output LED pins as one array.
for (var i = 0; i<ledPins.length; i++) {
 var led = new Gpio(ledPins[i], {mode: Gpio.OUTPUT});
 leds.push(led);
}
// LED channels sorted into R G and B
// for (var i = 0; i<channel1Pins.length; i++) { var led = new Gpio(channel1Pins[i], {mode: Gpio.OUTPUT}); channel1.push(led) }
// for (var i = 0; i<channel2Pins.length; i++) { var led = new Gpio(channel2Pins[i], {mode: Gpio.OUTPUT}); channel2.push(led) }
// for (var i = 0; i<channel3Pins.length; i++) { var led = new Gpio(channel3Pins[i], {mode: Gpio.OUTPUT}); channel3.push(led) }


//Input pins for 3 large red arcade buttons. Buttons changed to pullup because I2C bus has 1.8k pullups on
//by default. being experimented on 6/10
for (var i = 0; i<btnPins.length-1; i++) {
 var btn = new Gpio(btnPins[i], {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.RISING_EDGE,
    alert: true
  });
 btns.push(btn);
}
var btn3 = new Gpio(btnPins[2], {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.RISING_EDGE,
    alert: true
});
btns.push(btn3);

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
  console.log("\n---------------waitForInput function triggered-----------------");
  console.log("In waitForInput function. [globalState] is "+globalState);
  console.log("Waiting for input...");

  setInterval(colors.wait,8000);
  console.log("colors written to gpio"+Date.now());
}

function acknowledgeButtonPress(btn){
  console.log("\n------------acknowledgeButtonPress function triggered-----------");
  console.log("In acknowledgebuttonpress function. [globalState] is "+globalState);
  console.log("Button: "+btn+" press acknowledged");
    //Bright white, then fade to black before proceeding to next function.
    for(var j = 0; j<acknowledgeArray.length;j++){
      for(var i = 0; i<leds.length; i++){
        leds[i].pwmWrite(acknowledgeArray[j]);
      } //end led pwm writing loop
      sleep.msleep(20)
    } //end acknowledgeArray loop
}

function inspire(){
  console.log("\n-------------------Inspire function triggered-----------------");
  console.log("In inspire function (state 1). [globalState] is "+globalState);
  loopTime = Date.now(); //function starts, begin timer.

  var uninispire = setInterval(function(){ //run this every 8 seconds, checking for various song parts.
    currentTime = Date.now();
    console.log("current time: "+currentTime);
    console.log("loopTime: "+loopTime);
    if (currentTime - loopTime<40000){ //first part of the song, inspire1
        console.log("loop run time is: ["+currentTime-loopTime+"] and running inspire1");
        colors.inspire1();
    } else if (currentTime-loopTime>=40000 || currentTime - loopTime < 160000){
        console.log("loop run time is: ["+currentTime-loopTime+"] and running inspire2");
        colors.inspire2();
    } else if (currentTime-loopTime>=160000 || currentTime - loopTime < 205000){
        console.log("loop run time is: ["+currentTime-loopTime+"] and running inspire3");
        colors.inspire3();
    } else {
        console.log("loop run time is: ["+currentTime-loopTime+"] Clear interval");
        globalState = 0; //loop ran its course, set state to wait for switch case. .
        clearInterval(uninispire);
    }

  },8000);

  //play intro MP3
  //play inspirational MP3
  //change led's to cool/slow as it is going
  //return to wait state
}

function intrigue(){
  console.log("\n-----------------intrigue function triggered------------------");
  console.log("In intrigue function (state 2). [globalState] is "+globalState);
  var singleSongLength = 10000;
  loopTime = Date.now(); //function starts, begin timer.

  var unintrigue = setInterval(function(){ //run this every 8 seconds, checking for various song parts.

      currentTime = Date.now();
      if (currentTime - loopTime < singleSongLength){ //this will be the length of a random song.
          console.log("loop run time is: ["+currentTime-loopTime+"] and running intrigue");
          colors.intrigue();
       } else{
         console.log("loop run time is: ["+currentTime-loopTime+"] Clear interval");
         globalState = 0; //loop ran its course, set state to wait for switch case. .
         clearInterval(unintrigue);
       }

     },8000);

  //play solo 'intrigue show me what you got'
  //play one song
  //return to wait state
}

function danceParty(){
  console.log("\n---------------danceParty function triggered------------------");
  console.log("In danceParty function (state 3). [globalState] is "+globalState);

  var singleSongLength = 30000;
  loopTime = Date.now(); //function starts, begin timer.

  var undance = setInterval(function(){ //run this every 8 seconds, checking for various song parts.

      currentTime = Date.now();
      if (currentTime - loopTime < singleSongLength){ //this will be the length of a random song.
          console.log("loop run time is: ["+currentTime-loopTime+"] and running intrigue");
          colors.intrigue();
       } else{
         console.log("loop run time is: ["+currentTime-loopTime+"] Clear interval");
         globalState = 0; //loop ran its course, set state to wait for switch case. .
         clearInterval(undance);
       }

     },8000);

  //play solo 'dance party clip'
  //pick 3 songs from list at random
  //play songs
  //that stuff is async so
  //dance party LED's
  //return to wait state
}

//setInterval(waitForInput,50); //cycle through wait time indefinitely

waitForInput();
////////////////////////////Button Interrupt checking///////////////////////////
//check globalState to see if in function or not
btns[0].on('alert', _.debounce(function () { //IF BUTTON 1 IS HIT-----------
console.log("\nbutton 1 interrupt detected");
console.log("--------------Switch function for Button 1-----------------");
console.log("[globalState] state is currently: "+globalState);
  switch(globalState) { //start switch case
      case 0: //IF BUTTON 1 PRESSED IN WAIT MODE
          globalState=1; //If in wait mode, set state to 1 (intro)
          acknowledgeButtonPress(1); //Flash to Acknowledge state change
          btns[1].disableAlert(); // Stop events emitted from button 2
          btns[2].disableAlert(); // Stop events emitted from button 3
          inspire(); //go to state 1
          break;
      case 1: //IF BUTTON 1 PRESSED IN STATE 1 (INTRO)
          globalState=0; //If in button 1, return to wait mode 0
          acknowledgeButtonPress(1);
          btns[1].enableAlert(); // Start events emitted from button 2
          btns[2].enableAlert(); // Start events emitted from button 3
          // setInterval(waitForInput,50);
          waitForInput();
          break;
      default:
          console.log("Fail on button press 1");
  }
},200));//end switch case for BUTTON 1. Debounced 100ms-------------------------

btns[1].on('alert', _.debounce(function () { //IF BUTTON 2 IS HIT----------------------
  console.log("\nbutton 2 interrupt detected");
  console.log("--------------Switch function for Button 2-----------------");
  console.log("[globalState] state is currently: "+globalState);
  switch(globalState) { //start switch case
      case 0: //IF BUTTON 2 PRESSED IN WAIT MODE
          globalState=2; //If in wait mode, set state to 1 (intro)
          acknowledgeButtonPress(2); //Flash to Acknowledge state change
          btns[0].disableAlert(); // Stop events emitted from button 2
          btns[2].disableAlert(); // Stop events emitted from button 3
          intrigue(); //go to state 1
          break;
      case 2: //IF BUTTON 2 PRESSED IN STATE 2 (Intrigue)
          globalState=0; //If in button 1, return to wait mode 0
          acknowledgeButtonPress(2);
          btns[0].enableAlert(); // Start events emitted from button 2
          btns[2].enableAlert(); // Start events emitted from button 3
          waitForInput();
          break;
      default:
          console.log("Fail on button press 2");
  }
},200));;//end switch case for BUTTON 2-----------------------------------------------

btns[2].on('Alert', _.debounce(function () { //IF BUTTON 3 IS HIT-------------------------
  console.log("button 3 interrupt detected");
  console.log("--------------Switch function for Button 3-----------------");
  console.log("[globalState] state is currently: "+globalState);
  switch(globalState) { //start switch case
      case 0: //IF BUTTON 3 PRESSED IN WAIT MODE
          globalState=3; //If in wait mode, set state to 1 (intro)
          acknowledgeButtonPress(3); //Flash to Acknowledge state change
          btns[0].disableAlert(); // Stop events emitted from button 2
          btns[1].disableAlert(); // Stop events emitted from button 3
          danceParty(); //go to state 1
          break;
      case 3: //IF BUTTON 3 PRESSED IN STATE 3 (danceParty)
          globalState=0; //If in button 1, return to wait mode 0
          acknowledgeButtonPress(3);
          btns[0].enableAlert(); // Start events emitted from button 2
          btns[1].enableAlert(); // Start events emitted from button 3
          waitForInput();
          break;
      default:
          console.log("Fail on button press 3");
  }
},200));;//end switch case for BUTTON 3-----------------------------------------------
