"""Verify the checked-in golden against the pinned COMMUNITY ctok implementation.
Install upstream's dependencies in an isolated venv; pass its checkout path.
This checks community implementation parity, never Anthropic API accuracy.
"""
import hashlib, json, sys
from pathlib import Path
checkout=Path(sys.argv[1]).resolve()

root=Path(__file__).resolve().parents[1]
golden=json.loads((root/'tests/fixtures/ctok-community-golden.json').read_text())
expected_hashes={'ctok/notation.py': '8500af35b8d51cae0553867e53fe5da9e0f25521be686214ebba4c6c8fdf63c3', 'ctok/normalize.py': '00b80a30507e686e1f0d284c370db4bdc3ba494c79af6f1ed10fae5dad753cd6', 'ctok/main.py': '99d1decad615a7591d2125f474e3aee5b707b4206c2f1c9fce33ef850332aabf', 'ctok/engine.py': 'd6947168af9d27b51f1021c8604fd62eda315554cc8978c61eedc40b5aea6163', 'ctok/constants.py': '5df7840e0a1f99348c4bf875b2bd99e7c4235b8c15e82d550f591288fed8968f', 'ctok/__init__.py': '59632375adfa11aae7c628be782679183e8ee41e85167b0308fd5e5a6c78ebff', 'ctok/data/pieces_v4_7.json': 'a785fc240010c855f3d9a498fbd422ee389752dd151f1d5eef57ca8c85c19993'}
for name,sha in expected_hashes.items():
    assert hashlib.sha256((checkout/name).read_bytes()).hexdigest()==sha, f'Use pinned ctok source: {name}'
sys.path.insert(0,str(checkout))
import ctok
for case in golden['cases']:
    total=ctok.token_count(case['text'],'4.8')
    assert total==case['messageCount'] and total-6==case['count'],case['key']
print(f"{len(golden['cases'])} cases match pinned COMMUNITY ctok; no Anthropic API validation")
