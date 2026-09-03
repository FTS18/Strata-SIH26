"""
Utility to download sample Indian road dashcam clips and test weights for evaluation.
"""

import os
import urllib.request

SAMPLE_VIDEO_URL = "https://github.com/intel-iot-devkit/sample-videos/raw/master/car-detection.mp4"
SAMPLE_OUTPUT = os.path.join(os.path.dirname(__file__), "sample_dashcam.mp4")

def download_sample_media():
    if not os.path.exists(SAMPLE_OUTPUT):
        print(f"[DOWNLOADING] Sample road video stream to {SAMPLE_OUTPUT}...")
        try:
            urllib.request.urlretrieve(SAMPLE_VIDEO_URL, SAMPLE_OUTPUT)
            print("[DOWNLOAD COMPLETE] Sample video saved successfully.")
        except Exception as e:
            print(f"[WARNING] Could not download sample video: {e}")
    else:
        print("[READY] Sample dashcam video already exists.")

if __name__ == '__main__':
    download_sample_media()
