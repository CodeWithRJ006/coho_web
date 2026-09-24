import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('const Footer = () => (', 'export const Footer = () => (')
code = code.replace('group-hover:opacity-100 group-hover:scale-105"', 'group-hover:opacity-100"')

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
