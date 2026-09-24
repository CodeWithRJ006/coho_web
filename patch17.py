import os

with open('src/index.css', 'a', encoding='utf-8') as f:
    f.write('''
body {
  cursor: url('/cursor.svg') 12 12, auto;
}
a, button, [role="button"], .cursor-pointer {
  cursor: url('/cursor-pointer.svg') 12 12, pointer !important;
}
''')
