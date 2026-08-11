import fitz, os

pdfs = {
    "voiceover": "attached_assets/دورة_التعليق_الصوتي_أونلاين_-_بث_مباشر_وتفاعلي_1786451616062.pdf",
    "speaking":  "attached_assets/فن_الخطابة_والإلقاء_الجماهيري_المؤثر_1786451624093.pdf",
    "arabic":    "attached_assets/ﺗﻤﻜﻴﻦ_اﻟﻠﻐﺔ_اﻟﻌﺮﺑﻴﺔ_وﻓﻨﻮن_اﻟﺘﺤﺮﻳﺮ_اﻟﻠﻐة_1786451624094.pdf",
    "presenter": "attached_assets/الدورة_المكثفة_المذيع_المحترف_ومهارات_الإعلام_الرقمي_1786451626185.pdf",
}

os.makedirs(".agents/outputs/pdfs", exist_ok=True)

for name, path in pdfs.items():
    doc = fitz.open(path)
    print(f"\n=== {name} ({doc.page_count} pages) ===")
    for i, page in enumerate(doc):
        txt = page.get_text("text")
        print(f"--- page {i+1} ---")
        print(txt[:3000])
        # render first 3 pages
        if i < 3:
            pix = page.get_pixmap(matrix=fitz.Matrix(1.8, 1.8))
            out = f".agents/outputs/pdfs/{name}_p{i+1}.png"
            pix.save(out)
    doc.close()
