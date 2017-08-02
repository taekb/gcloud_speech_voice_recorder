/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// Account for different environments
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = new AudioContext();
var audioInput = null,
	inputPoint = null,
	audioRecorder = null;
var recIndex = 0; // Recorded file #
var isRecording = false; // flag

function gotBuffers(buffers) {
	//audioRecorder.exportWAV(doneEncoding);
	audioRecorder.exportMonoWAV(doneEncoding);
}

function gotBuffersPCM(buffers) {
	//audioRecorder.exportPCM(doneEncodingPCM);
	audioRecorder.exportMonoPCM(doneEncodingPCM);
}

function doneEncoding(blob) {
	var recFile = "RecordedFile_" + recIndex + ".wav";
	Recorder.setupPlayback(blob, recFile);
	Recorder.setupDownload(blob, recFile);
	saveAudio(blob);
	recIndex++;
}

function doneEncodingPCM(blob) {
	var recFile = ["RecordedFile_" + recIndex + ".wav", "RecordedFile_" + recIndex + ".pcm"];
	Recorder.setupPlayback(blob[0], recFile[0]);
	Recorder.setupDownload(blob[1], recFile[1]);
	saveAudioBlob(blob);
	recIndex++;
}

function saveAudio(blob) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onload = function() {
		detectedText = this.responseText;
		$("#p_caption").text(detectedText);
	}
	httpRequest.open("POST", "http://localhost:8100/uploads", true);
	httpRequest.send(blob);
}

function toggleRecording() {
	var micIcon = document.getElementById("mic");
	isRecording = !isRecording;

	if (isRecording) { // Now recording (i.e. isRecording = true)
		if (!audioRecorder) { // If audioRecorder does not exist
			return; 
		} // If audioRecorder exists
		micIcon.src = "http://localhost:8100/static/images/microphone_recording.png";
		$("#show_rec_status").attr("style", "visiblility:visible");
		audioRecorder.clear();
		audioRecorder.record();
	}
	else { // Now stopping (i.e. isRecording = false)
		micIcon.src = "http://localhost:8100/static/images/microphone_idle.png";
		$("#show_rec_status").attr("style", "visibility:hidden");
		audioRecorder.stop();
		formats = document.getElementsByName("file_format");
		for (var i = 0; i < formats.length; i++) {
			if (formats[i].checked) {
				switch (formats[i].value) {
					case "WAV":
						audioRecorder.getBuffers(gotBuffers);
						break;
					case "PCM":
						audioRecorder.getBuffers(gotBuffersPCM);
						break;
				}
			}
		}
	}
}

function gotStream(stream) {
	audioInput = audioContext.createMediaStreamSource(stream); // Audio Input Node
	gainNode = audioContext.createGain(); // Gain Node to amplify audio stream
	audioInput.connect(gainNode);

	audioRecorder = new Recorder(gainNode); // Create Recorder object that receives audio data via Gain Node

	zeroGain = audioContext.createGain();
	zeroGain.gain.value = 0.0;
	inputPoint.connect(zeroGain);
	zeroGain.connect(audioContext.destination);
	//inputPoint.connect(audioContext.destination);
}

function setupAudio() {
	// Account for different environments
	if (!navigator.getUserMedia) {
		navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	}

	navigator.getUserMedia(
		{
			"audio": {
				"mandatory": {
					"googEchoCancellation": "false",
					"googAutoGainControl": "false",
					"googNoiseSuppression": "false",
					"googHighpassFilter": "false"
				},
				"optional": []
			},
		}, gotStream, function(e) {
			alert("Error: Audio source for recording not found.");
			console.log(e);
		});
	// Media Access가 성공하면 callback function인 gotStream()을 MediaStream object를 parameter값으로 pass하여 호출
}

window.addEventListener('load', setupAudio);
