import sys
import whisper
import io

# 🔥 Force UTF-8 output (Windows fix)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

audio_path = sys.argv[1]

model = whisper.load_model("base")

result = model.transcribe(audio_path, language="ta")

# 🔥 Print exact spoken text (Unicode safe)
print(result["text"])
