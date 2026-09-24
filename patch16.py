import re

with open('src/EventsPage.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add import
if 'import { Footer } from' not in code:
    code = code.replace("import { EVENTS_DATA } from './eventsData';", "import { EVENTS_DATA } from './eventsData';\nimport { Footer } from './App';")

# 2. Add Footer component at the bottom
old_bottom = "      )}\n    </div>\n  );\n};"
new_bottom = "      )}\n      <Footer />\n    </div>\n  );\n};"
if '<Footer />' not in code:
    code = code.replace(old_bottom, new_bottom)

with open('src/EventsPage.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
