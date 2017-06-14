// ================================================================== //
//                             Songs.js                               //
// Generates lists and object collections so mp3's can be played      //
// in the main program with less visual clutter                       //
// ================================================================== //
const fs = require('fs');
// const omx = require('node-omx');
var omx = require('omxdirector');

///////////////////////////////File locations///////////////////////////////////
const state1Folder = './songs/state1/';
const state2Folder = './songs/state2/';
const state3Folder = './songs/state3/';

var state1names = [];
var state2names = [];
var state3names = [];
///////////////////////// Populate arrays of songs ////////////////////////
fs.readdir(state1Folder, (err, files) => {
  files.forEach(file => {
    state1names.push(file);
  });
});
fs.readdir(state2Folder, (err, files) => {
  files.forEach(file => {
    state2names.push(file);
  });
});
fs.readdir(state3Folder, (err, files) => {
  files.forEach(file => {
    state3names.push(file);
  });
});
//////////////////////////////////////////////////////////////////////////
//Picks random songs from a bank and stores them in an array as strings.
var pickRandom = function(songCount){
  var requestedSongs = [];
  for(var i = 0;i<songCount;i++){
      var song = state3names[randomInt(0,state3names.length-1)];
      requestedSongs.push(song);
      if(i==songCount-1){
        return requestedSongs;
      }
  }
}
//Clean random method with a min and max value
function randomInt(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}
//////////////////////////////////////////////////////////////////////////
//Initialize OMX objects for player.
var playSongs = function(state,numSongs){
  if(state==1){ //play only inspire song
    omx.setVideoDir('/home/pi/shadow-shroud/songs/state1/');
    omx.play('state1.mp3', {audioOutput: 'local'});
  }
  else if(state==2){ //play intro, 1 song, outro.
    var queue = ['/home/pi/shadow-shroud/songs/state2/state2start.mp3',pickRandom(1).toString(),'/home/pi/shadow-shroud/songs/state2/state2end.mp3'];
    omx.setVideoDir('/home/pi/shadow-shroud/songs/state3/');
    omx.play(queue, {audioOutput: 'local'});
  }
  else if(state==3){
    var queue = pickRandom(numSongs);
    omx.setVideoDir('/home/pi/shadow-shroud/songs/state3/');
    omx.play(queue, {audioOutput: 'local'});
  }
  else{
    console.log("playSongs has failed! Panic!");
  }
}

var getStatus = function(){

var status = omx.getStatus();
var tmp = Object.keys(status).map(function(key){
  return status[key];
});
return tmp[3];
  // return omx.isPlaying();
}

var stopSongs = function(){
  omx.stop();
}
/////////////////////////////////////Exports////////////////////////////////////
module.exports.state1names = state1names;
module.exports.state2names = state2names;
module.exports.state3names = state3names;
module.exports.pickRandom = pickRandom;
module.exports.playSongs = playSongs;
module.exports.getStatus = getStatus;
module.exports.stopSongs = stopSongs;
module.exports.omx = omx;

/////////////////////////////////////Debug shtuff///////////////////////////////
// setTimeout(function(){
//   console.log("Three random songs:");
//   console.log(pickRandom(5));
// },1000);

// setTimeout(function(){
//   console.log("Three random songs:");
//   playSongs(3,3);
//
// },1000);
