import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replacements dictionary
    replacements = {
        r'text-muted-foreground': 'text-foreground/60',
        r'text-\[\#888\]': 'text-foreground/60',
        r'text-\[\#555\]': 'text-foreground/50',
        r'text-\[\#444\]': 'text-foreground/40',
        r'text-\[\#666\]': 'text-foreground/40',
        r'text-\[\#999\]': 'text-foreground/70',
        r'text-gray-400': 'text-foreground/60',
        r'text-gray-500': 'text-foreground/50',
        r'text-gray-600': 'text-foreground/40',
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
