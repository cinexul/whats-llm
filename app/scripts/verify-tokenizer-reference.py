"""Offline golden verification. Install tokenizers==0.23.3 tiktoken==0.14.0 in a venv.
Run from app/: python scripts/verify-tokenizer-reference.py. No model weights/API.
"""
import gzip, json, unicodedata
from pathlib import Path
import tokenizers, tiktoken
root = Path(__file__).resolve().parents[1]
qwen = tokenizers.Tokenizer.from_str(gzip.decompress((root / 'static/tokenizers/qwen38.json.gz').read_bytes()).decode())
openai = tiktoken.get_encoding('o200k_base')
golden = json.loads((root / 'tests/fixtures/tokenizer-golden.json').read_text())
for row in golden['rows']:
    for name, reference in [('qwen38', qwen), ('o200k', openai)]:
        ids = (reference.encode(row['text'], add_special_tokens=False).ids if name == 'qwen38' else reference.encode(row['text'], disallowed_special=()))
        assert ids == row[name]['ids'], (row['key'], name, 'IDs')
        expected = unicodedata.normalize('NFC', row['text']) if name == 'qwen38' else row['text']
        assert ''.join(piece['text'] for piece in row[name]['pieces']) == expected, (row['key'], name, 'display')
print(f"{len(golden['rows'])} cases: all IDs and display roundtrips match official Python; tokenizers {tokenizers.__version__}, tiktoken {tiktoken.__version__}")
