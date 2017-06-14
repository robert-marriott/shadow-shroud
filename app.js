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


var colors = require("./colors.js"); //colors.js has RGB fading information
var songs = require("./songs.js"); //songs.js creates song objects and lists

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
var intrigueTimer = 0;
var inspireTimer = 0;
var partyTimer = 0;
var waitTimer = 0;

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

  //Input pins for 3 large red arcade buttons. Buttons changed to pullup because I2C bus has 1.8k pullups on
  //by default.
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
  // There are going to be 5 states.
  // State 0: Wait     => Lights fade green blue, maybe purple. "Cool/Slow"
  // State 1: Button 1 => Inspire. Lights fade through a few cooler to warmer colors
  // State 2: Button 2 => Intrigue. Fast paced, warm colors. One song.
  // State 3: Button 3 => Party! Fast paced, strobing, 3 songs.
  // State 4: Acknowledge => pulse of bright white light that fades on button press
  ////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////Main Methods////////////////////////////////
  //---------------------------------------------------------------------------//
  //                           State 0: waitForInput                           //
  //---------------------------------------------------------------------------//
  function waitForInput(){
    console.log("\n---------------waitForInput function triggered-----------------");
    console.log("In waitForInput function. [globalState] is "+globalState);
    console.log("Waiting for input...");

    var loopTime = Date.now(); //function starts, begin timer.

    colors.wait();
    waitTimer = setInterval(function(){
      var currentTime = Date.now();
      var testTime = currentTime - loopTime;
      console.log("loop run time is: ["+testTime+"] and running waitForInput");
      colors.wait();
    },8000);

  }
  //---------------------------------------------------------------------------//
  //                           State 1: intrigue                               //
  //---------------------------------------------------------------------------//
  function inspire(){
    console.log("\n-------------------Inspire function triggered-----------------");
    console.log("In inspire function (state 1). [globalState] is "+globalState);
    var loopTime = Date.now(); //function starts, begin timer.

    inspireTimer = setInterval(function(){ //run this every 8 seconds, checking for various song parts.
      var currentTime = Date.now();
      var testTime = currentTime - loopTime;

      if (testTime<40000){ //first part of the song, inspire1
        console.log("loop run time is: ["+testTime+"] and running inspire1");
        colors.inspire1();
      } else if (testTime>=40000 && testTime < 160000){
        console.log("loop run time is: ["+testTime+"] and running inspire2");
        colors.inspire2();
      } else if (testTime>=160000 && testTime < 210000){
        console.log("loop run time is: ["+testTime+"] and running inspire3");
        colors.inspire3();
      } else {
        console.log("loop run time is: ["+testTime+"] Clear interval");
        globalState = 0; //loop ran its course, set state to wait for switch case. .
        clearInterval(inspireTimer);
        songs.stopSongs();
        btns[1].enableAlert(); // Start events emitted from button 2
        btns[2].enableAlert(); // Start events emitted from button 3
        acknowledgeButtonPress(-1);
        waitForInput();
      }
    },8000);
  }

  //---------------------------------------------------------------------------//
  //                          State 2: intrigue                                //
  //---------------------------------------------------------------------------//
  function intrigue(){
    console.log("\n-----------------intrigue function triggered------------------");
    console.log("In intrigue function (state 2). [globalState] is "+globalState);
    var loopTime = Date.now(); //function starts, begin timer.

    intrigueTimer = setInterval(function(){ //run this every 8 seconds, checking for various song parts.
      currentTime = Date.now();
      var testTime = currentTime - loopTime;
      // if (testTime < singleSongLength){ //this will be the length of a random song.
      if(songs.getStatus()){
        console.log("loop run time is: ["+testTime+"] and running intrigue");
        colors.intrigue();
      } else{
        songs.stopSongs();
        console.log("loop run time is: ["+testTime+"] State completed. Clear interval");
        globalState = 0; //loop ran its course, set state to wait for switch case. .
        clearInterval(intrigueTimer);
        btns[0].enableAlert(); // Start events emitted from button 2
        btns[2].enableAlert(); // Start events emitted from button 3
        acknowledgeButtonPress(-1);
        waitForInput();
      }

    },8000);

    //play solo 'intrigue show me what you got'
    //play one song
    //return to wait state
  }
  //---------------------------------------------------------------------------//
  //                            State 3: danceParty                            //
  //---------------------------------------------------------------------------//
  function danceParty(){
    console.log("\n---------------danceParty function triggered------------------");
    console.log("In danceParty function (state 3). [globalState] is "+globalState);

    var singleSongLength = 30000;
    var loopTime = Date.now(); //function starts, begin timer.

    partyTimer = setInterval(function(){ //run this every 8 seconds, checking for various song parts.
      currentTime = Date.now();
      var testTime = currentTime - loopTime;
      if (testTime < singleSongLength){ //this will be the length of a random song.
        console.log("loop run time is: ["+testTime+"] and running intrigue");
        colors.intrigue();
      } else{
        console.log("loop run time is: ["+testTime+"] Clear interval");
        globalState = 0; //loop ran its course, set state to wait for switch case. .
        clearInterval(partyTimer);
        btns[0].enableAlert(); // Start events emitted from button 2
        btns[1].enableAlert(); // Start events emitted from button 3
        acknowledgeButtonPress(-1);
        waitForInput();
      }
    },8000);
  }

  //---------------------------------------------------------------------------//
  //                    State 4: acknowledgeButtonPress                        //
  //---------------------------------------------------------------------------//
  function acknowledgeButtonPress(btn){
    console.log("\n------------acknowledgeButtonPress function triggered-----------");
    console.log("In acknowledgebuttonpress function. [globalState] is "+globalState);
    console.log("Button: "+btn+" press acknowledged");
    colors.acknowledge();
    //Bright white, then fade to black before proceeding to next function.
    // for(var j = 0; j<acknowledgeArray.length;j++){
    //   for(var i = 0; i<leds.length; i++){
    //     leds[i].pwmWrite(acknowledgeArray[j]);
    //   } //end led pwm writing loop
    //   sleep.msleep(20)
    // } //end acknowledgeArray loop
  }

//////////////////////////////Supporting Methods////////////////////////////////
function clearAllTimers(){ //Clears all setInterval timers on state transition
  clearInterval(inspireTimer);
  clearInterval(intrigueTimer);
  clearInterval(partyTimer);
  clearInterval(waitTimer);
}

function blackenLEDs(){ //Turns LED's to black between transitions
  for(var i = 0; i<leds.length; i++){
    leds[i].pwmWrite(0);
  } //end led pwm writing loop
}

  waitForInput();
  //---------------------------------------------------------------------------//
  //                        Button Interrupt handlers                          //
  //---------------------------------------------------------------------------//
  btns[0].on('alert', _.debounce(function () { //IF BUTTON 1 IS HIT-----------
    console.log("\nbutton 1 interrupt detected");
    console.log("--------------Switch function for Button 1-----------------");
    console.log("[globalState] state is currently: "+globalState);
    clearAllTimers(); //stop execution of whatever state LEDs
    switch(globalState) { //start switch case
      case 0: //IF BUTTON 1 PRESSED IN WAIT MODE
        globalState=1; //If in wait mode, set state to 1 (intro)
        acknowledgeButtonPress(1); //Flash to Acknowledge state change
        songs.playSongs(1,0); //load up the inspire song
        btns[1].disableAlert(); // Stop events emitted from button 2
        btns[2].disableAlert(); // Stop events emitted from button 3
        inspire(); //go to state 1
        break;
      case 1: //IF BUTTON 1 PRESSED IN STATE 1 (INTRO)
        globalState=0; //If in button 1, return to wait mode 0
        acknowledgeButtonPress(1);
        songs.stopSongs();
        btns[1].enableAlert(); // Start events emitted from button 2
        btns[2].enableAlert(); // Start events emitted from button 3
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
    clearAllTimers(); //stop execution of whatever state LEDs
    switch(globalState) { //start switch case
      case 0: //IF BUTTON 2 PRESSED IN WAIT MODE
        globalState=2; //If in wait mode, set state to 1 (intro)
        acknowledgeButtonPress(2); //Flash to Acknowledge state change
        songs.playSongs(2,1);
        btns[0].disableAlert(); // Stop events emitted from button 2
        btns[2].disableAlert(); // Stop events emitted from button 3
        intrigue(); //go to state 1
        break;
      case 2: //IF BUTTON 2 PRESSED IN STATE 2 (Intrigue)
        globalState=0; //If in button 1, return to wait mode 0
        acknowledgeButtonPress(2);
        songs.stopSongs();
        btns[0].enableAlert(); // Start events emitted from button 2
        btns[2].enableAlert(); // Start events emitted from button 3
        waitForInput();
        break;
      default:
      console.log("Fail on button press 2");
    }
  },200));;//end switch case for BUTTON 2-----------------------------------------------

  btns[2].on('alert', _.debounce(function () { //IF BUTTON 3 IS HIT-------------------------
    console.log("button 3 interrupt detected");
    console.log("--------------Switch function for Button 3-----------------");
    console.log("[globalState] state is currently: "+globalState);
    clearAllTimers(); //stop execution of whatever state LEDs
    switch(globalState) { //start switch case
      case 0: //IF BUTTON 3 PRESSED IN WAIT MODE
        globalState=3; //If in wait mode, set state to 1 (intro)
        acknowledgeButtonPress(3); //Flash to Acknowledge state change
        songs.playSongs(3,3);
        btns[0].disableAlert(); // Stop events emitted from button 2
        btns[1].disableAlert(); // Stop events emitted from button 3
        danceParty(); //go to state 1
        break;
      case 3: //IF BUTTON 3 PRESSED IN STATE 3 (danceParty)
        globalState=0; //If in button 1, return to wait mode 0
        acknowledgeButtonPress(3);
        songs.stopSongs();
        btns[0].enableAlert(); // Start events emitted from button 2
        btns[1].enableAlert(); // Start events emitted from button 3
        waitForInput();
        break;
      default:
      console.log("Fail on button press 3");
    }
  },200));;//end switch case for BUTTON 3-----------------------------------------------
