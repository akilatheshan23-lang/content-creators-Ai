from PIL import Image

def remove_black_background(img_path, out_path, tolerance=30):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Check if pixel is black or very dark
        if item[0] < tolerance and item[1] < tolerance and item[2] < tolerance:
            # Fully transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(out_path, "PNG")

if __name__ == "__main__":
    remove_black_background("hero-bird.png", "logo-transparent.png")
