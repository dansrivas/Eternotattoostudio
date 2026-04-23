import re

def fix_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix the double-encoded characters in title/meta
    content = content.replace('CuliacÃ¡n', 'Culiacán')
    content = content.replace('â€”', '—')
    content = content.replace('Â¡Hazlo Eterno!', '¡Hazlo Eterno!')
    
    # Fix the duplicated/corrupted meta description line 9
    content = re.sub(r'content="Eterno Tattoo Studio.*?Tatuajes de alta gama en Culiac.*?¡Hazlo Eterno!" />', 
                     'content="Eterno Tattoo Studio — Tatuajes de alta gama en Culiacán. Especialistas en realismo, blackwork y arte inmersivo por Dans y Salem. ¡Hazlo Eterno!" />', content)

    # Fix Diamonds in all spans
    content = re.sub(r'(<span class="diamond[^>]*>)(.*?)(</span>)', r'\1◆\3', content)

    # Any other specific corrupted patterns like in the screenshot
    content = content.replace('Â¿QUÂ©', '¿QUÉ')
    content = content.replace('TRILOGÂÃ', 'TRILOGÍA')
    content = content.replace('LÃÃNEA', 'LÍNEA')

    with open('index.html', 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    print("Fixed index.html")

if __name__ == "__main__":
    fix_index()
