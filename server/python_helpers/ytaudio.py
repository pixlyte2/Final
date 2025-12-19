import sys
import subprocess
import os

def download_audio(youtube_url, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "audio_%(id)s.%(ext)s")

    cmd = [
        "yt-dlp",
        "-f", "bestaudio",
        "--extract-audio",
        "--audio-format", "mp3",
        "-o", output_path,
        youtube_url
    ]

    subprocess.run(cmd, check=True)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python ytaudio.py <youtube_url> <output_dir>")
        sys.exit(1)

    yt_url = sys.argv[1]
    out_dir = sys.argv[2]

    download_audio(yt_url, out_dir)
