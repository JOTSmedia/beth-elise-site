from PIL import Image
img = Image.open('/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/puppeteer_screen_10s.png')
img.crop((0, 0, img.width, 400)).save('/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/crop.png')
