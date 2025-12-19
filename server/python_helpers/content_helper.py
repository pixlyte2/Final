@'
#!/usr/bin/env python
import sys, json, re

def safe_join_words(text, n):
    words = re.findall(r'\w+', text)
    return " ".join(words[:n])

def generate_title(transcript):
    t = safe_join_words(transcript, 12)
    return (t if len(t) > 0 else "Video Transcription")[:90]

def generate_topic(transcript):
    first = safe_join_words(transcript, 18)
    return (first[:200] + "...") if len(first) > 200 else first

def generate_description(transcript):
    short = safe_join_words(transcript, 50)
    long = safe_join_words(transcript, 250)
    return f"{short}\n\n{long}\n\nTimestamps included."

def generate_hashtags(transcript):
    words = re.findall(r'\w+', transcript.lower())
    freq = {}
    for w in words:
        if len(w) < 3:
            continue
        freq[w] = freq.get(w, 0) + 1
    tags = sorted(freq, key=freq.get, reverse=True)[:8]
    return [f"#{t}" for t in tags]

def rewrite_text(transcript):
    sentences = re.split(r"(?<=[.!?]) +", transcript.strip())
    rewritten = []
    for s in sentences:
        s = s.strip()
        if s:
            rewritten.append(s.capitalize())
    return "\n\n".join(rewritten)

def thumbnail_ideas(title):
    return [
        f"Use bold text: '{title[:40]}...' with yellow background",
        "Use emoji on left + short Tamil hook in center"
    ]

def main():
    raw = sys.stdin.read()
    try:
        data = json.loads(raw)
    except:
        print(json.dumps({"error": "invalid input"}))
        sys.exit(1)

    transcript = data.get("transcript", "").strip()
    if not transcript:
        print(json.dumps({"error": "empty transcript"}))
        sys.exit(1)

    result = {
        "title": generate_title(transcript),
        "topic": generate_topic(transcript),
        "description": generate_description(transcript),
        "shortDescription": safe_join_words(transcript, 25),
        "script": rewrite_text(transcript),
        "metaTags": {
            "title": generate_title(transcript),
            "description": generate_description(transcript)
        },
        "hashtags": generate_hashtags(transcript),
        "thumbnailIdeas": thumbnail_ideas(generate_title(transcript)),
        "rewritten": rewrite_text(transcript)
    }

    print(json.dumps(result, ensure_ascii=False))

if __name__ == '__main__':
    main()
'@ | Out-File -FilePath .\content_helper.py -Encoding utf8
