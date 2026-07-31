import os
from PIL import Image, ImageOps

ASSETS_DIR = "/home/rubuntu/Projects/Websites/aqua-bloom-portal/src/assets/products"
THUMBNAILS_DIR = os.path.join(ASSETS_DIR, "thumbnails")

os.makedirs(THUMBNAILS_DIR, exist_ok=True)

# Target specs: (name_suffix, width, height, aspect_ratio_str)
SPECS = [
    ("4x3_lg", 800, 600, "4:3"),
    ("4x3_sm", 400, 300, "4:3"),
    ("1x1_lg", 600, 600, "1:1"),
    ("1x1_sm", 300, 300, "1:1"),
    ("2x3_lg", 600, 900, "2:3"),
    ("2x3_sm", 300, 450, "2:3"),
]

def make_thumbnail(img: Image.Image, target_width: int, target_height: int) -> Image.Image:
    """
    Fits image within (target_width, target_height) maintaining aspect ratio
    and pads (expands canvas) with transparency or background color.
    """
    # Create a copy
    img_copy = img.copy()
    img_copy.thumbnail((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Determine mode & canvas color
    if img.mode == "RGBA" or "transparency" in img.info:
        canvas_mode = "RGBA"
        bg_color = (0, 0, 0, 0)
    else:
        canvas_mode = "RGB"
        bg_color = (255, 255, 255)
        
    canvas = Image.new(canvas_mode, (target_width, target_height), bg_color)
    
    # Paste centered
    offset_x = (target_width - img_copy.width) // 2
    offset_y = (target_height - img_copy.height) // 2
    
    if canvas_mode == "RGBA":
        canvas.paste(img_copy, (offset_x, offset_y), img_copy if img_copy.mode == "RGBA" else None)
    else:
        canvas.paste(img_copy, (offset_x, offset_y))
        
    return canvas

def process_all():
    valid_exts = {".png", ".jpg", ".jpeg", ".webp"}
    processed_count = 0
    
    for filename in sorted(os.listdir(ASSETS_DIR)):
        if filename.startswith("."):
            continue
        ext = os.path.splitext(filename)[1].lower()
        if ext not in valid_exts:
            continue
            
        base_name = os.path.splitext(filename)[0]
        # Ignore already generated thumbnails
        if "_" in base_name and any(base_name.endswith(suffix) for suffix, _, _, _ in SPECS):
            continue
            
        filepath = os.path.join(ASSETS_DIR, filename)
        
        try:
            with Image.open(filepath) as img:
                img.load()
                for suffix, w, h, _ in SPECS:
                    out_filename = f"{base_name}_{suffix}.webp"
                    out_path = os.path.join(THUMBNAILS_DIR, out_filename)
                    
                    thumb = make_thumbnail(img, w, h)
                    thumb.save(out_path, "WEBP", quality=90)
                    
            processed_count += 1
            print(f"✅ Processed {filename} -> {len(SPECS)} thumbnails")
        except Exception as e:
            print(f"❌ Error processing {filename}: {e}")
            
    print(f"\n✨ Finished processing {processed_count} images!")

if __name__ == "__main__":
    process_all()
