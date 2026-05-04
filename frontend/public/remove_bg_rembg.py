from rembg import remove
from PIL import Image
import os

input_path = 'hero-bird.png'
output_path = 'logo-transparent.png'

print("Loading image...")
input_img = Image.open(input_path)
print("Removing background using rembg...")
output_img = remove(input_img)
print("Saving image...")
output_img.save(output_path)
print("Done!")
