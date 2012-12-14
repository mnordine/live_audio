var analyserView1;
var receivedAudioBuffer;

var socket = io.connect('http://marknordine.live_audio.jit.su');
socket.on('sound_data', function (data) {
  //console.log(typeof data);
  if(analyserView1 != undefined) {
  	receivedAudioBuffer = new Uint8Array(data)
  }
});

o3djs.require('o3djs.shader');

function output(str) {
    console.log(str);
}

// Events
// init() once the page has finished loading.
window.onload = init;

var context;
var source;
var analyser;
var buffer;
var audioBuffer;

// Added by me
var soundData;

function error() {
    alert('Stream generation failed.');
    finishJSTest();
}

function getUserMedia(dictionary, callback) {
    try {
        navigator.webkitGetUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('webkitGetUserMedia threw exception :' + e);
        finishJSTest();
    }
}

function gotStream(stream) {
    s = stream;

    analyserView1 = new AnalyserView("view1");

    initAudio(stream);
    analyserView1.initByteBuffer();

    soundData = new Uint8Array(analyser.frequencyBinCount);

    window.requestAnimationFrame(draw);

    setInterval(function() {
    	analyser.getByteFrequencyData(soundData);
    	//console.log(soundData);
   	 	socket.emit('sound_data', soundData);
    }, 30);
}

function init() {
    getUserMedia({audio:true}, gotStream);
}

function initAudio(stream) {
    context = new webkitAudioContext();
    
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.1;
    analyser.fftSize = 2048;

    // Connect audio processing graph:
    // live-input -> analyser -> destination

    // Create an AudioNode from the stream.
    var mediaStreamSource = context.createMediaStreamSource(stream);    
    mediaStreamSource.connect(analyser);
    analyser.connect(context.destination);

    window.requestAnimationFrame(draw);
}

if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = ( function() {

                return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                        window.setTimeout( callback, 1000 / 60 );

                };
        } )();
}

function draw() {

		// Update sound analysis view if we've received
		// sound data from another user
    if(receivedAudioBuffer != undefined) {
   	 analyserView1.drawGL(receivedAudioBuffer);
   	}

    window.requestAnimationFrame(draw);
}