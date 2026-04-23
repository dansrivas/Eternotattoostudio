import sys
import os

filepath = r"c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\index.html"

with open(filepath, 'rb') as f:
    content = f.read()

# Since the file might have been decoded poorly or holds utf-8 strings mixed with bad encodings,
# Let's decode it with errors='replace' to see what it is
text = content.decode('utf-8', errors='replace')

text = text.replace("CuliacÃ¡n", "Culiacán")
text = text.replace("â€”", "—")
text = text.replace("Â¡", "¡")
text = text.replace("HIDRATACI\"N", "HIDRATACIÓN")
text = text.replace("ENCU?NTRANOS AQUÍ", "ENCUÉNTRANOS AQUÍ")
text = text.replace("C\"MO LLEGAR", "CÓMO LLEGAR")
text = text.replace("DISE'O", "DISEÑO")
text = text.replace("? DESCARGAR TARJETA", "⬇️ DESCARGAR TARJETA")

# For the powershell injection on lines 448-452 and 905-908
injection = """    param($match)
    return $match.Value -replace '(?<=>).*?(?=</span>)', 'â—†'
 ESPECIALES ETERNO"""
text = text.replace(injection.replace('â—†', 'â—†'), '<span class="diamond">◆</span> ESPECIALES Y PROMOCIONES')

injection2 = """    param($match)
    return $match.Value -replace '(?<=>).*?(?=</span>)', 'â—†'
 CONTACTO"""
text = text.replace(injection2, '<span class="diamond">◆</span> CONTACTO')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print("Done replacing.")
