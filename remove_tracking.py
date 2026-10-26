import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace tracking-tight with nothing (being careful of extra spaces)
    # This matches ' tracking-tight' or 'tracking-tight ' or just 'tracking-tight'
    new_content = re.sub(r'\s*tracking-tight\s*', ' ', content)
    
    # Also clean up multiple spaces created inside classNames
    # we don't want to mess up other strings, but inside classNames it's usually safe
    # Or just let it be, tailwind handles multiple spaces fine.
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Done.")
