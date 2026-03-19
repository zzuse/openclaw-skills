import sys
import re

def preprocess_latex(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove one or more empty lines after \vspace{...}
    # This ensures that \vspace and the following text are on adjacent lines
    processed_content = re.sub(r'(\\vspace\{[^}]+\})\s*\n\s*\n+', r'\1\n', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(processed_content)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 preprocess.py <file.tex>")
        sys.exit(1)
    
    preprocess_latex(sys.argv[1])
