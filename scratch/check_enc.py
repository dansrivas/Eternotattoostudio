import sys

def check_encoding(filepath):
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
            
        # Try to decode as utf-8
        try:
            text = content.decode('utf-8')
            print("Successfully decoded as UTF-8")
        except UnicodeDecodeError as e:
            print(f"Failed to decode as UTF-8: {e}")
            return

        # Check for mojibake patterns
        # á in UTF-8 is C3 A1. If misinterpreted as latin-1, it becomes Ã¡
        # Let's look for "Ã¡" (C3 83 C2 A1 in UTF-8 if double-encoded, or just C3 A1 seen as Latin-1)
        
        lines = text.splitlines()
        for i, line in enumerate(lines):
            # Check for strings like "Ã¡", "â€”", "Â¡", "Ã‘"
            # These are characteristic of UTF-8 read as Latin-1 and then saved as UTF-8
            if any(p in line for p in ["Ã¡", "â€”", "Â¡", "Ã‘", "Ã³", "Ã", "Ãº", "Ã±"]):
                print(f"Line {i+1} might be corrupted: {line}")
            
            # Also check for the specific "Culiacǭn" or other weird ones if they exist
            if "Culiac" in line and "Culiacán" not in line:
                 print(f"Line {i+1} has weird Culiacan: {line}")

        print("Check complete.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_encoding(r'c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\index.html')
