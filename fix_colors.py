import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replacements dictionary
    replacements = {
        r'bg-\[\#111\]': 'bg-card',
        r'bg-\[\#0a0a0a\]': 'bg-background',
        r'bg-\[\#141414\]': 'bg-card',
        r'bg-black': 'bg-background',
        r'text-white': 'text-foreground',
        r'text-\[\#555\]': 'text-muted-foreground',
        r'text-\[\#444\]': 'text-muted-foreground',
        r'text-\[\#666\]': 'text-muted-foreground',
        r'text-\[\#888\]': 'text-muted-foreground',
        r'text-\[\#999\]': 'text-muted-foreground',
        r'border-white/\[0\.0[0-9]\]': 'border-border',
        r'border-white/\[0\.[1-9][0-9]\]': 'border-border',
        r'bg-white/\[0\.0[0-9]\]': 'bg-muted',
        r'bg-white/\[0\.[1-9][0-9]\]': 'bg-muted/50',
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
