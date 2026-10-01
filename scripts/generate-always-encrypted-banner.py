from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1280, 680
OUT = Path(__file__).resolve().parents[1] / "public/images/blog/always-encrypted-sql-server-practical-guide.gif"
FONT = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")


def font(size: int, bold: bool = False):
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT), size)


def centered(draw, xy, text, fnt, fill):
    box = draw.textbbox((0, 0), text, font=fnt)
    draw.text((xy[0] - (box[2] - box[0]) / 2, xy[1]), text, font=fnt, fill=fill)


def arrow(draw, start, end, color="#2686bd", width=6):
    draw.line((start, end), fill=color, width=width)
    x, y = end
    draw.polygon([(x, y), (x - 18, y - 11), (x - 18, y + 11)], fill=color)


def card(draw, box, fill, outline, title, subtitle):
    draw.rounded_rectangle(box, radius=24, fill=fill, outline=outline, width=3)
    cx = (box[0] + box[2]) // 2
    centered(draw, (cx, box[1] + 38), title, font(23, True), "#15324a")
    centered(draw, (cx, box[1] + 80), subtitle, font(15), "#587186")


frames = []
durations = []
stages = [
    ("1  Parameter", "Plaintext enters the approved driver", 0),
    ("2  Metadata", "The driver learns which parameter is encrypted", 1),
    ("3  Key access", "The approved identity unwraps the CEK", 2),
    ("4  Encrypt", "Encryption happens before the value leaves the client", 3),
    ("5  Store", "SQL Server receives ciphertext only", 4),
]

for label, message, active in stages:
    for motion in range(3):
        image = Image.new("RGB", (WIDTH, HEIGHT), "#ffffff")
        d = ImageDraw.Draw(image)
        d.rounded_rectangle((24, 24, WIDTH - 24, HEIGHT - 24), radius=28, outline="#c8dbea", width=3)
        d.text((68, 62), "ALWAYS ENCRYPTED", font=font(17, True), fill="#155e95")
        d.text((68, 98), "Readable data stops at the client boundary", font=font(38, True), fill="#102f48")
        d.text((68, 148), "The driver uses external keys, then sends only ciphertext to SQL Server.", font=font(19), fill="#587186")

        app = (65, 245, 330, 485)
        driver = (420, 245, 685, 485)
        server = (950, 245, 1215, 485)
        key = (690, 515, 945, 620)
        card(d, app, "#eff7fd", "#8cbada", "Application", "approved plaintext zone")
        card(d, driver, "#eefaf6", "#65bea0", "Client driver", "encrypts and decrypts")
        card(d, server, "#f3f6fa", "#9eb3c6", "SQL Server", "ciphertext only")
        d.rounded_rectangle(key, radius=18, fill="#fff8e6", outline="#deb446", width=3)
        centered(d, (817, 538), "External key store", font(20, True), "#7c5900")
        centered(d, (817, 574), "CMK unwraps CEK", font(15), "#6c6656")

        centered(d, (197, 360), "987-65-4320", font(23, True), "#155e95")
        centered(d, (552, 350), "ENCRYPT", font(18, True), "#047857")
        centered(d, (1082, 360), "0x01A74C9E…", font(20, True), "#173d5d")
        arrow(d, (330, 365), (405, 365), "#2788c1")
        arrow(d, (685, 365), (930, 365), "#2788c1")
        d.line((817, 515, 630, 485), fill="#d09a13", width=5)
        d.polygon([(630, 485), (648, 481), (642, 499)], fill="#d09a13")

        # Moving signal: plaintext -> metadata -> key -> ciphertext.
        if active == 0:
            x = 335 + motion * 25
            d.ellipse((x - 10, 355, x + 10, 375), fill="#2686bd")
        elif active == 1:
            d.rounded_rectangle((488, 408, 616, 442), radius=17, fill="#dceefa")
            centered(d, (552, 415), "metadata", font(13, True), "#155e95")
        elif active == 2:
            x = 800 - motion * 55
            y = 500 - motion * 8
            d.ellipse((x - 11, y - 11, x + 11, y + 11), fill="#e2a91a")
        elif active == 3:
            r = 22 + motion * 6
            d.ellipse((552 - r, 372 - r, 552 + r, 372 + r), outline="#12a77f", width=6)
        else:
            x = 720 + motion * 90
            d.rounded_rectangle((x, 350, x + 72, 380), radius=8, fill="#173d5d")

        d.rounded_rectangle((65, 535, 625, 620), radius=18, fill="#f5f9fc", outline="#d1e0eb", width=2)
        d.text((88, 555), label, font=font(16, True), fill="#155e95")
        d.text((88, 584), message, font=font(15), fill="#526b80")
        frames.append(image)
        durations.append(260 if motion < 2 else 850)

frames[0].save(
    OUT,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    optimize=True,
    disposal=2,
)
print(f"Created {OUT} ({OUT.stat().st_size:,} bytes, {len(frames)} frames)")
