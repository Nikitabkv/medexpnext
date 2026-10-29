"""Render the unchanged public company PDFs for a browser-independent modal viewer."""
import json
from pathlib import Path
import pypdfium2 as pdfium

root = Path(__file__).resolve().parent.parent
directory = root / 'public' / 'documents'
output = directory / 'previews'
output.mkdir(exist_ok=True)
manifest = {}
for filename in ['company-contract.pdf', 'company-privacy.pdf', 'human-rights-policy.pdf']:
    document = pdfium.PdfDocument(directory / filename)
    pages = []
    for index in range(len(document)):
        page = document[index]
        bitmap = page.render(scale=1.9)
        image = bitmap.to_pil().convert('RGB')
        target = f'{Path(filename).stem}-{index + 1}.webp'
        image.save(output / target, 'WEBP', quality=92, method=6)
        pages.append({'src': f'/documents/previews/{target}', 'width': image.width, 'height': image.height})
        image.close()
        bitmap.close()
        page.close()
    document.close()
    manifest[f'/documents/{filename}'] = pages
    print(filename, len(pages), 'rendered pages')
(root / 'src' / 'lib' / 'legal-previews.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
