from pathlib import Path
from PIL import Image

root = Path('/home/ubuntu/savoro-restaurant-theme/savoro-wordpress-theme/assets')
for path in root.glob('*'):
    if path.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
        continue
    source = Image.open(path)
    has_alpha = source.mode in {'RGBA', 'LA'} or ('transparency' in source.info)
    image = source.convert('RGBA' if has_alpha and path.suffix.lower() == '.png' else 'RGB')
    image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
    if path.suffix.lower() in {'.jpg', '.jpeg'}:
        image.save(path, quality=82, optimize=True, progressive=True)
    else:
        image.save(path, optimize=True)
    print(path.name, image.size, path.stat().st_size)
