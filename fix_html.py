import re

with open('index.html', 'r') as f:
    html = f.read()

# The snippet we appended everywhere accidentally
snippet = """<div class="form-group">
          <label for="review-text">Your Star Rating *</label>
          <div class="star-rating-picker" id="star-picker">
            <span class="star-pick active" data-val="1">★</span>
            <span class="star-pick active" data-val="2">★</span>
            <span class="star-pick active" data-val="3">★</span>
            <span class="star-pick active" data-val="4">★</span>
            <span class="star-pick active" data-val="5">★</span>
          </div>
        </div>

        <div class="form-group">
          <label for="review-text">Your Testimonial Story *</label>
          <textarea id="review-text" required placeholder="Describe your experience, insights received, or how your session with Beth impacted your journey..."></textarea>
        </div>

        <div class="form-group">
          <label for="review-google-link">Link to Google Review (Optional)</label>
          <input type="url" id="review-google-link" placeholder="https://maps.app.goo.gl/... (Optional)" />
        </div>

        <button type="submit" class="form__submit"><span class="pico pico--sparkle" aria-hidden="true"></span> Submit Testimonial</button>
      </form>"""

# Find all occurrences of the snippet
occurrences = [m.start() for m in re.finditer(re.escape(snippet), html)]
print(f"Found {len(occurrences)} occurrences of the snippet")

# We want to keep ONLY the one inside <div id="testimonial-modal">!
# Which one is that? It's the one that comes right after the first half of the testimonial form.
# The first half of the testimonial form has:
# <select id="review-service" required>
# ...
# </select>
# </div>

# Let's remove ALL of them first!
html = html.replace(snippet, "")

# Now let's carefully place it EXACTLY where it belongs.
# We want to place it after:
marker = """<select id="review-service" required>
              <option value="" disabled selected>Select Service...</option>
              <option value="Psychic Mediumship Reading">Psychic Mediumship Reading</option>
              <option value="Reiki Energy Healing">Reiki Energy Healing</option>
              <option value="The Tapping Solution (EFT)">The Tapping Solution (EFT)</option>
              <option value="Notes by Beth (Soul Letter)">Notes by Beth (Soul Letter)</option>
            </select>
          </div>
        </div>"""

if marker in html:
    html = html.replace(marker, marker + "\n\n        " + snippet)
    print("Re-inserted snippet correctly!")
else:
    print("Could not find marker!")

with open('index.html', 'w') as f:
    f.write(html)
