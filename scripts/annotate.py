from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

base = Path("screenshots/light")
img = Image.open(base / "workspace.png").convert("RGB")
w, h = img.size
legend_h = 150
canvas = Image.new("RGB", (w, h + legend_h), "white")
canvas.paste(img, (0, 0))
draw = ImageDraw.Draw(canvas)

font_bold = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 26)
font_small = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 23)

badges = [
    (1, 108, 185, 147, 185),
    (2, 590, 185, None, None),
    (3, 108, 420, 147, 420),
    (4, 368, 255, 399, 255),
    (5, 960, 255, 996, 255),
    (6, 108, 950, 147, 950),
]
for number, x, y, target_x, target_y in badges:
    radius = 23
    if target_x is not None:
        draw.line((x + radius, y, target_x, target_y), fill="#1f6f5c", width=2)
    draw.ellipse(
        (x - radius, y - radius, x + radius, y + radius),
        fill="#1f6f5c",
        outline="white",
        width=3,
    )
    text = str(number)
    box = draw.textbbox((0, 0), text, font=font_bold)
    tw, th = box[2] - box[0], box[3] - box[1]
    draw.text((x - tw / 2, y - th / 2 - 3), text, font=font_bold, fill="white")

draw.rectangle((0, h, w, h + legend_h), fill="white")
draw.line((0, h, w, h), fill="#d7dfdb", width=2)
draw.text((34, h + 22), "1 — набір даних", font=font_small, fill="#33413a")
draw.text((300, h + 22), "2 — алгоритм", font=font_small, fill="#33413a")
draw.text((530, h + 22), "3 — керування", font=font_small, fill="#33413a")
draw.text((770, h + 22), "4 — полотно графа", font=font_small, fill="#33413a")
draw.text((34, h + 75), "5 — стан алгоритму", font=font_small, fill="#33413a")
draw.text((300, h + 75), "6 — таблиця вершин", font=font_small, fill="#33413a")
canvas.save(base / "workspace-annotated.png")

mobile = Image.open(base / "workspace-mobile.png").convert("RGB")
crop_height = min(1180, mobile.height)
mobile.crop((0, 0, mobile.width, crop_height)).save(base / "workspace-mobile-crop.png")
print("annotated", canvas.size, "mobile crop", (mobile.width, crop_height))
