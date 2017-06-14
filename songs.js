// ================================================================== //
//                             Songs.js                               //
// Generates lists and object collections so mp3's can be played      //
// in the main program with less visual clutter                       //
// ================================================================== //
const fs = require('fs');
var omx = require('omxdirector');
var mp3Duration = require('mp3-duration');

///////////////////////////////File locations///////////////////////////////////
const state1Folder = './songs/state1/';
const state2Folder = './songs/state2/';
const state3Folder = './songs/state3/';

var state1names = [];
var state2names = [];
var state3names = [];
var mp3Durations = [];
var selectedDurations = [];
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
// setTimeout(function(){
  for(var i = 0;i<state3names.length;i++){
    var tmp1 = "/home/pi/shadow-shroud/songs/state3/";
    var tmp2 = state3names[i].toString();
    var path = tmp1.concat(tmp2);
    mp3Duration(path, function (err, duration) {
      if (err) return console.log(err.message);
      var dur = duration;
      console.log("enumerating mp3 duration list. current entry: "+dur);
      mp3Durations.push(dur);
    });
  }
// },500);

//////////////////////////////////////////////////////////////////////////
//Picks random songs from a bank and stores them in an array as strings.
var pickRandom = function(songCount){
  var requestedSongs = [];
  selectedDurations = []; //clear selected durations whenever random songs are picked

  for(var i = 0;i<songCount;i++){
    var randInt = randomInt(0,state3names.length-1);
      var song = state3names[randInt];
      selectedDurations.push(mp3Durations[randInt]);
      requestedSongs.push(song);
      console.log("Random songs picked:\n"+requestedSongs);
      console.log("Song durations of these songs:"+selectedDurations);
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

var totalSongDuration = function(){
  var playTime = 0;
  for(var i = 0;i<selectedDurations.length;i++){
    playTime+=selectedDurations[i];
    if(i==selectedDurations.length-1){
      return playTime*1000;
    }
  }
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
module.exports.totalSongDuration = totalSongDuration;

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
// setTimeout(function(){
//   pickRandom(3);
//   setTimeout(function(){
//     console.log(mp3Durations);
//     // console.log("Selected Durations of picked songs\n"+selectedDurations);
//   },1000);
// },1000);
setInterval(function(){
  console.log(state3names);
  console.log(mp3Durations);
},10000);
