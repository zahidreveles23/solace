"""Creates the secret download pages under store/get/<token>/ (kept out of git).
Re-run after rebuilding a product .xlsx to refresh the files. Tokens persist in store-tokens.json."""
import json, os, secrets, shutil

names = {"hustle": "Side Hustle Income & Tax Tracker", "debt": "Debt Payoff Planner", "bundle": "Money Tracker Bundle"}
files = {"hustle": [("Hustle-Ledger.xlsx", "hustle-ledger/Hustle-Ledger.xlsx")],
         "debt": [("Debt-Free-Plan.xlsx", "debt-payoff/Debt-Free-Plan.xlsx")]}
files["bundle"] = files["hustle"] + files["debt"]

tok = json.load(open("store-tokens.json")) if os.path.exists("store-tokens.json") else {}
for k in names:
    tok.setdefault(k, secrets.token_hex(8))
json.dump(tok, open("store-tokens.json", "w"), indent=2)

for k, fl in files.items():
    d = f"store/get/{tok[k]}"
    os.makedirs(d, exist_ok=True)
    links = "".join(f'<a class="dl" href="{f}" download>Download {f}</a>\n' for f, _ in fl)
    for f, src in fl:
        shutil.copy(src, f"{d}/{f}")
    with open(f"{d}/index.html", "w") as out:
        out.write(f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Your download</title><link rel="stylesheet" href="../../style.css"></head><body>
<main class="thanks"><h1>Thank you!</h1><p>Your <b>{names[k]}</b> is ready.</p>
{links}<h2>How to open it</h2><ol>
<li><b>Excel:</b> open the downloaded file.</li>
<li><b>Google Sheets:</b> go to drive.google.com, upload the file, then open it with Google Sheets.</li>
<li>Start on the <b>Start Here</b> tab. Yellow cells are yours to fill in.</li></ol>
<p class="muted">Bookmark this page to download again later. Questions? Email us at the address on your receipt.</p></main></body></html>""")
for k in names:
    print(f"{names[k]:36} /get/{tok[k]}/")
