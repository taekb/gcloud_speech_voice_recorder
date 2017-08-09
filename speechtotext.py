#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Copyright 2016 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


def speech_recog():
    # [START speech_quickstart]
    import io
    import os

    # Imports the Google Cloud client library
    from google.cloud import speech

    # Instantiates a client
    speech_client = speech.Client()
    
    # Flag to check detection
    detected = True

    # The name of the audio file to transcribe
    file_name = os.path.join(
        os.path.dirname(__file__),
        'resources',
        'RecordedFile.wav')

    # Loads the audio into memory
    with io.open(file_name, 'rb') as audio_file:
        content = audio_file.read()
        sample = speech_client.sample(
            content,
            source_uri=None,
            encoding='LINEAR16',
            sample_rate_hertz=44100)

    # Detects speech in the audio file
    try:
        alternatives = sample.recognize('ko-KR')
        # alternatives = sample.recognize('en-US')
    except ValueError:
        detected = False

    outFile = open('/data/gcloudapi/speech/cloud-client/result/result.txt', 'w')
    if detected:
        for alternative in alternatives:
            outFile.write(alternative.transcript)
    else:
        outFile.write('No Voice Detected.')

    outFile.close()

    # [END speech_quickstart]


if __name__ == '__main__':
    speech_recog()
