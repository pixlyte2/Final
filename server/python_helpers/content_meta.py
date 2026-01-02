import sys
import subprocess
import json

if len(sys.argv) < 2:
    print(json.dumps({"success": False, "error": "No URL provided"}))
    sys.exit(0)

url = sys.argv[1]

cmd = [
    "yt-dlp",
    "-J",                      # 🔥 ALWAYS return JSON
    "--no-warnings",
    "--quiet",
    url
]

p = subprocess.run(
    cmd,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# If yt-dlp returned nothing
if not p.stdout.strip():
    print(json.dumps({
        "success": False,
        "error": p.stderr or "yt-dlp returned empty output"
    }))
    sys.exit(0)

try:
    data = json.loads(p.stdout)

    # Shorts sometimes return entries
    if "entries" in data and len(data["entries"]) > 0:
        data = data["entries"][0]

    print(json.dumps({
        "success": True,
        "title": data.get("title", ""),
        "description": data.get("description", "")
    }))
except Exception as e:
    print(json.dumps({
        "success": False,
        "error": str(e)
    }))
