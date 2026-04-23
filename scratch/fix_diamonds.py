import re
import os

def fix_diamonds(filename):
    if not os.path.exists(filename):
        print(f"File {filename} not found")
        return
        
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Target all diamond spans and replace their inner text with the diamond symbol
    new_content = re.sub(r'(<span class="diamond[^>]*>)(.*?)(</span>)', r'\1◆\3', content)
    
    # Also fix any remaining corrupted symbols if found by pattern
    # e.g. "â—†" or other common corrupted diamond sequences
    # Based on the user's report of "Â—†" and "â—†"
    corrupted_patterns = ["â—†", "Â—†", "-?", "", "â—", "-"]
    for pattern in corrupted_patterns:
        new_content = new_content.replace(pattern, "◆")

    with open(filename, 'w', encoding='utf-8', newline='') as f:
        f.write(new_content)
    print(f"Diamonds fixed in {filename}")

if __name__ == "__main__":
    fix_diamonds('index.html')
    fix_diamonds('styles.css')
