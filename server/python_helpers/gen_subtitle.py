@'
#!/usr/bin/env python
import sys, os, json, re
from pathlib import Path

def simple_chunk_srt(transcript, seconds_per_chunk=5):
    words = re.findall(r'\w+|\S', transcript)
    if not words:
        return ""
    wps = 3.5
    chunk_words = max(8, int(seconds_per_chunk * wps))
    chunks = [words[i:i+chunk_words] for i in range(0, len(words), chunk_words)]
    srt_lines = []
    t = 0.0

    def fmt(sec):
        h = int(sec // 3600)
        m = int((sec % 3600) // 60)
        s = int(sec % 60)
        ms = int((sec - int(sec)) * 1000)
        return f"{h:02}:{m:02}:{s:02},{ms:03}"

    for i, ch in enumerate(chunks, start=1):
        start = t
        end = t + seconds_per_chunk

        srt_lines.append(str(i))
        srt_lines.append(f"{fmt(start)} --> {fmt(end)}")
        srt_lines.append(" ".join(ch))
        srt_lines.append("")

        t = end

    return "\n".join(srt_lines)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error":"audio path required"}))
        sys.exit(1)

    audio = sys.argv[1]
    txt_candidate = audio + ".txt"
    out_srt = os.path.join(os.path.dirname(audio), Path(audio).stem + ".srt")
    out_vtt = os.path.join(os.path.dirname(audio), Path(audio).stem + ".vtt")

    transcript = ""
    if os.path.exists(txt_candidate):
        transcript = open(txt_candidate, "r", encoding="utf8").read().strip()

    if not transcript:
        print(json.dumps({"error":"no transcript found"}))
        sys.exit(1)

    srt_text = simple_chunk_srt(transcript)
    with open(out_srt, "w", encoding="utf8") as f:
        f.write(srt_text)

    vtt_text = "WEBVTT\n\n" + srt_text.replace(",", ".")
    with open(out_vtt, "w", encoding="utf8") as f:
        f.write(vtt_text)

    print(json.dumps({"srtPath": out_srt, "vttPath": out_vtt}))
    sys.exit(0)

if __name__ == "__main__":
    main()
'@ | Out-File -FilePath .\gen_subtitle.py -Encoding utf8
