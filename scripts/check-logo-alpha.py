from PIL import Image

for path in [
    "/home/ubuntu/webdev-static-assets/savoro-steam-s-logo.png",
    "/home/ubuntu/savoro-restaurant-theme/savoro-wordpress-theme/assets/savoro-steam-s-logo_2851daf5.png",
]:
    image = Image.open(path).convert("RGBA")
    samples = {point: image.getpixel(point) for point in [(0, 0), (10, 10), (image.width // 2, image.height // 2)]}
    alpha_values = [pixel[3] for pixel in image.getdata()]
    print(path, "mode=", Image.open(path).mode, "samples=", samples, "min_alpha=", min(alpha_values), "max_alpha=", max(alpha_values))
