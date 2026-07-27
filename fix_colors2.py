import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replacements dictionary
    replacements = {
        r'bg-\[\#111111\]': 'bg-card',
        r'bg-\[\#161616\]': 'bg-card',
        r'bg-\[\#181818\]': 'bg-card',
        r'bg-\[\#1e1e1e\]': 'bg-muted',
        r'bg-\[\#1a2e1a\]': 'bg-primary/20',
        r'bg-\[\#a8e63d\]': 'bg-primary',
        r'border-\[\#232323\]': 'border-border',
        r'border-\[\#1e1e1e\]': 'border-border',
        r'border-\[\#2a2a2a\]': 'border-border',
        r'border-\[\#333\]': 'border-border',
        r'border-\[\#141414\]': 'border-border',
        r'text-\[\#333\]': 'text-muted-foreground',
        r'text-\[\#a8e63d\]': 'text-primary',
        r'hover:text-\[\#ccc\]': 'hover:text-foreground',
    }

    new_content = content
    for pattern, repl in replacements.items():
        new_content = re.sub(pattern, repl, new_content)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Done.")
