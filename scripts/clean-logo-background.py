from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/webdev-static-assets/savoro-steam-s-logo.png')
targets = [
    Path('/home/ubuntu/webdev-static-assets/savoro-steam-s-logo.png'),
    Path('/home/ubuntu/savoro-restaurant-theme/savoro-wordpress-theme/assets/savoro-steam-s-logo_2851daf5.png'),
]

image = Image.open(source).convert('RGBA')
pixels = []
for red, green, blue, alpha in image.getdata():
    if alpha and red < 24 and green < 24 and blue < 24:
        pixels.append((red, green, blue, 0))
    else:
        pixels.append((red, green, blue, alpha))
image.putdata(pixels)
for target in targets:
    image.save(target, 'PNG', optimize=True)
    print(target, image.size, image.mode)
