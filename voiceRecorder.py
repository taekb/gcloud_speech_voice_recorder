#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Jul 14 17:37:57 2017

@author: 정택영 (Daniel Jeong)
"""

from flask import Flask, render_template, request
import subprocess

PATH = '../gcloudapi/speech/cloud-client/'

app = Flask(__name__)

@app.route('/')
def init_recorder():
    return render_template('VoiceRecorder.html')
    
@app.route('/uploads', methods=['POST'])
def save_audio():
    rawAudio = request.get_data()
    audioFile = open(PATH + 'resources/RecordedFile.wav', 'wb')
    audioFile.write(rawAudio)
    audioFile.close()
    return speech_to_text()
    
def speech_to_text():
    subprocess.run('python3 /data/gcloudapi/speech/cloud-client/speechtotext.py', shell=True)
    inFile = open(PATH + 'result/result.txt', 'r')
    transcript = ''
    for line in inFile:
        transcript += line
    print(transcript)
    return transcript
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8100)
