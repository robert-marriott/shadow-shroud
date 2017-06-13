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


function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}


///////////////////////////////////////////////////////////////////////////////
var wait = function(){ //Loop this on waitForInput. Cool fading with some purple.
  channel1.fadeRgb(medBlue, 500, function() {
    channel1.fadeRgb(blue, 2000, function() {
      channel1.fadeRgb(aqua, 2500, function() {
        channel1.fadeRgb(yellow, 3000); }); }); });

  channel2.fadeRgb(softGreen, 1000,function() {
    channel2.fadeRgb(aqua, 1500, function() {
      channel2.fadeRgb(purple, 2500, function() {
        channel2.fadeRgb(blue, 3000); }); }); });

  channel3.fadeRgb(purple, 3000,function() {
    channel3.fadeRgb(green, 2000, function() {
      channel3.fadeRgb(blue, 1000, function() {
        channel3.fadeRgb(aqua, 2000); }); }); });
}
///////////////////////////////////////////////////////////////////////////////
var inspire1 = function(){
//40 seconds slowwww cool colors.
channel1.fadeRgb(softRed, 1000, function() {
  channel1.fadeRgb(blue, 2000, function() {
    channel1.fadeRgb(aqua, 3000, function() {
      channel1.fadeRgb(yellow, 2000); }); }); });

channel2.fadeRgb(green, 2000,function() {
  channel2.fadeRgb(aqua, 1500, function() {
    channel2.fadeRgb(purple, 3000, function() {
      channel2.fadeRgb(blue, 1500); }); }); });

channel3.fadeRgb(yellow, 1000,function() {
  channel3.fadeRgb(purple, 2500, function() {
    channel3.fadeRgb(softRed, 2500, function() {
      channel3.fadeRgb(aqua, 2000); }); }); });
}
///////////////////////////////////////////////////////////////////////////////
var inspire2 = function(){
// 120 seconds speedier, cool slightly warmer
channel1.fadeRgb(medRed, 2000, function() {
  channel1.fadeRgb(blue, 2000, function() {
    channel1.fadeRgb(orange, 2000, function() {
      channel1.fadeRgb(yellow, 2000); }); }); });

channel2.fadeRgb(orange, 2000,function() {
  channel2.fadeRgb(aqua, 2000, function() {
    channel2.fadeRgb(purple, 2000, function() {
      channel2.fadeRgb(blue, 2000); }); }); });

channel3.fadeRgb(yellow, 2000,function() {
  channel3.fadeRgb(purple, 2000, function() {
    channel3.fadeRgb(medRed, 2000, function() {
      channel3.fadeRgb(aqua, 2000); }); }); });
}
///////////////////////////////////////////////////////////////////////////////
var inspire3 = function(){
//44 seconds fast, add in some warm
channel1.fadeRgb(red, 2000, function() {
  channel1.fadeRgb(blue, 2000, function() {
    channel1.fadeRgb(aqua, 2000, function() {
      channel1.fadeRgb(yellow, 2000); }); }); });

channel2.fadeRgb(purple, 2000,function() {
  channel2.fadeRgb(orange, 2000, function() {
    channel2.fadeRgb(blue, 2000, function() {
      channel2.fadeRgb(aqua, 2000); }); }); });

channel3.fadeRgb(orange, 2000,function() {
  channel3.fadeRgb(purple, 2000, function() {
    channel3.fadeRgb(red, 2000, function() {
      channel3.fadeRgb(aqua, 2000); }); }); });
}
///////////////////////////////////////////////////////////////////////////////
var intrigue = function() {
  //state 2, fast LED's of all colors.
  //generate a few random colors to sprinkle into dance coloring.
  var rand1 = new Colour(randomInt(0,100),randomInt(0,100),randomInt(0,100));
  var rand2 = new Colour(randomInt(0,100),randomInt(0,100),randomInt(0,100));
  var rand3 = new Colour(randomInt(0,100),randomInt(0,100),randomInt(0,100));

  channel1.strobeRgb(rand1, 300, 2700, function() {
    channel1.fadeRgb(blue, 1000,        function() {
      channel1.fadeRgb(rand3, 1500,       function() {
        channel1.fadeRgb(yellow, 500,     function() {
          channel1.fadeRgb(rand2, 1000,       function() {
            channel1.strobeRgb(green, 300, 1300); }); }); }); }); });

  channel2.fadeRgb(rand2, 1000,         function() {
    channel2.strobeRgb(orange, 300, 2000, function() {
      channel2.strobeRgb(rand1, 300, 2000, function() {
        channel2.fadeRgb(aqua, 1000,        function() {
          channel2.fadeRgb(rand3, 1000,       function() {
            channel2.fadeRgb(red, 1000); }); }); }); }); });

  channel3.fadeRgb(rand3, 1500,         function() {
    channel3.strobeRgb(yellow, 300, 1500, function() {
      channel3.fadeRgb(rand1, 1000,         function() {
        channel2.fadeRgb(purple, 500,       function() {
          channel2.strobeRgb(rand3, 300, 3000,  function() {
            channel3.fadeRgb(aqua, 500); }); }); }); }); });

}
///////////////////////////////////////////////////////////////////////////////
var danceParty = function() {
  //state 3, dance party. honestly this can probably just be a repeat of intrigue.
}






module.exports.wait = wait;
module.exports.inspire1 = inspire1;
module.exports.inspire2 = inspire2;
module.exports.inspire3 = inspire3;
module.exports.intrigue = intrigue;
module.exports.danceParty = danceParty;
