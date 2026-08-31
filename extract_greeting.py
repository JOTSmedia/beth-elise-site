import re

with open('css/style.css', 'r') as f:
    css = f.read()

# Find the block starting with "  .beth-greeting {" and its contents until the next unindented block or end of media query
# It's easier to just do it via exact string matching if possible
# Let's search for "  /* Assistant & speech bubbles on tablet/mobile */" 
media_query_match = re.search(r'  /\* Assistant & speech bubbles on tablet/mobile \*/[\s\S]*?\}\n\}', css)

if media_query_match:
    # We will just write a regex to replace the bad indentation and move it outside
    pass

