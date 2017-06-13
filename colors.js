// ================================================================== //
//                              colors.js                             //
// Sets up colors and RGB channels to flash LED's pretty colors.      //
// Available through module.exports to the main app.js                //
// ================================================================== //

//note for later, make all the color schemes in here and import with
// exports later. cleaner in the loops.

var RgbChannel = require('rpi-rgb').Channel;
var Colour = require('rpi-rgb').Colour;

// 3 LED strings separated into channels
var channel1 = new RgbChannel(15,16,1); //BCM 14,15,18
var channel2 = new RgbChannel(0,2,3); //BCM 17,27,22
var channel3 = new RgbChannel(6,10,11);   //BCM 25,8,7

// Colors lots of colors. in intensity values 0-100
var softRed = new Colour(10,0,0); //RED
var medRed = new Colour(50,0,0);
var red = new Colour(100,0,0);
var softGreen = new Colour(0,10,0);//GREEN
var medGreen = new Colour(0,50,0);
var green = new Colour(0,100,0);
var softBlue = new Colour(0,0,10); //BLUE
var medBlue = new Colour(0,50,0);
var blue = new Colour(0,100,0);
var softPurple = new Colour(10,0,10); //pPURPLE
var medPurple = new Colour(50,0,50);
var purple = new Colour(100,0,100);
var yellow = new Colour(100,100,0); //yellow
var aqua = new Colour(0,100,100); //aqua
var orange = new Colour(100,40,0); //orange

var white = new Colour(100,100,100);
var black = new Colour(0,0,0);

// while(true){
//   console.log("test color loop running");
var wait = function(){ //Loop this on waitForInput. Cool fading with some purple.
  channel1.fadeRgb(medBlue, 2000, function() {
    channel1.fadeRgb(blue, 2000, function() {
      channel1.fadeRgb(aqua, 2000, function() {
        channel1.fadeRgb(medBlue, 2000); }); }); });

  channel2.fadeRgb(green, 2000,function() {
    channel2.fadeRgb(aqua, 2000, function() {
      channel2.fadeRgb(purple, 2000, function() {
        channel2.fadeRgb(green, 2000); }); }); });

  channel3.fadeRgb(aqua, 2000,function() {
    channel3.fadeRgb(purple, 2000, function() {
      channel3.fadeRgb(green, 2000, function() {
        channel3.fadeRgb(aqua, 2000); }); }); });
}

module.exports.wait = wait;
