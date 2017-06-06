// ================================================================== //
// solids.js just picks a static color to display for debugging       //
// reasons. It evolved shortly after wanting to turn LED's 'off'      //
// It takes command line arguements and parses them into colors.      //
// ================================================================== //
console.log("[INFO] Picking a static color (solids.js)");
console.log("[INFO] Arguements passed to app.js:");
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
///////////////////////////Setup////////////////////////////////////////
// Import necessary libraries.
var Gpio = require('pigpio').Gpio;
// Pin declarations
var ledPins = [14,15,18,   17,27,22,   25,8,7];
var redPins = [14,17,25];
var grnPins = [15,27,8];
var bluPins = [18,22,7];
// Empty arrays to hold gpio objects
var reds = [];
var grns = [];
var blus = [];
// initialise all the output pins. they are grouped into RGB channels.
for (var i = 0; i<redPins.length; i++) { var led = new Gpio(redPins[i], {mode: Gpio.OUTPUT}); reds.push(led) }
for (var i = 0; i<grnPins.length; i++) { var led = new Gpio(grnPins[i], {mode: Gpio.OUTPUT}); grns.push(led) }
for (var i = 0; i<bluPins.length; i++) { var led = new Gpio(bluPins[i], {mode: Gpio.OUTPUT}); blus.push(led) }
/////////////////////////Program///////////////////////////////////////
switch(process.argv[2]) {
    case "off":
        setColor(0,0,0);
        break;
    case "white":
        setColor(255,255,255);
        break;
    case "red":
        setColor(255,0,0);
        break;
    case "green":
        setColor(0,255,0);
        break;
    case "blue":
        setColor(0,0,255);
        break;
    default:
        console.log("Manual coloring detected.");
        setColor(process.argv[2],process.argv[3],process.argv[4])
}

function setColor(red,grn,blu){
  for(var i = 0; i<reds.length; i++) { reds[i].pwmWrite(red); }   //channel 1 - RED
  for(var i = 0; i<grns.length; i++) { grns[i].pwmWrite(grn); }   //channel 1 - GRN
  for(var i = 0; i<blus.length; i++) { blus[i].pwmWrite(blu); }   //channel 1 - BLU
}
