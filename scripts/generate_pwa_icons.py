"""
Generate high-resolution PWA icons for store-web and store-management-system.
Uses PIL to draw crisp branded Ricky Mobile Store icons.
"""

from PIL import Image, ImageDraw
import os

def create_rms_icon(size: int, is_maskable: bool = False, is_admin: bool = False) -> Image.Image:
    # 32-bit RGBA image
    img = Image.new("RGBA", (size, size), (7, 7, 15, 255))
    draw = ImageDraw.Draw(img)

    # Padding calculation
    pad = int(size * 0.18) if is_maskable else int(size * 0.08)
    w = size - 2 * pad
    h = size - 2 * pad

    # Outer border for standard icons
    if not is_maskable:
        corner_r = int(size * 0.22)
        # Subtle glowing border
        draw.rounded_rectangle(
            [(pad // 2, pad // 2), (size - pad // 2, size - pad // 2)],
            radius=corner_r,
            outline=(0, 207, 255, 75),
            width=max(1, int(size * 0.015))
        )

    # Smartphone dimensions
    phone_w = int(w * 0.54)
    phone_h = int(h * 0.82)
    phone_x0 = (size - phone_w) // 2
    phone_y0 = (size - phone_h) // 2
    phone_x1 = phone_x0 + phone_w
    phone_y1 = phone_y0 + phone_h
    phone_radius = int(phone_w * 0.16)
    stroke_w = max(2, int(size * 0.045))

    # Draw phone body
    cyan = (0, 207, 255, 255)
    draw.rounded_rectangle(
        [(phone_x0, phone_y0), (phone_x1, phone_y1)],
        radius=phone_radius,
        outline=cyan,
        width=stroke_w
    )

    # Speaker notch at top
    speaker_w = int(phone_w * 0.36)
    speaker_x0 = (size - speaker_w) // 2
    speaker_x1 = speaker_x0 + speaker_w
    speaker_y = phone_y0 + int(phone_h * 0.12)
    draw.line(
        [(speaker_x0, speaker_y), (speaker_x1, speaker_y)],
        fill=cyan,
        width=max(1, int(stroke_w * 0.75))
    )

    # Home / fingerprint button at bottom
    btn_r = max(2, int(phone_w * 0.065))
    btn_cx = size // 2
    btn_cy = phone_y1 - int(phone_h * 0.14)
    draw.ellipse(
        [(btn_cx - btn_r, btn_cy - btn_r), (btn_cx + btn_r, btn_cy + btn_r)],
        fill=cyan
    )

    # If admin icon, add a subtle badge / gear or admin dot
    if is_admin:
        badge_r = max(3, int(size * 0.08))
        badge_cx = phone_x1 - int(phone_w * 0.1)
        badge_cy = phone_y0 + int(phone_h * 0.1)
        draw.ellipse(
            [(badge_cx - badge_r, badge_cy - badge_r), (badge_cx + badge_r, badge_cy + badge_r)],
            fill=(139, 92, 246, 255), # Purple accent for admin
            outline=(255, 255, 255, 200),
            width=max(1, int(size * 0.015))
        )

    return img

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    web_public = os.path.join(root, "store-web", "public")
    cms_public = os.path.join(root, "store-management-system", "public")

    os.makedirs(web_public, exist_ok=True)
    os.makedirs(cms_public, exist_ok=True)

    # Generate store-web icons
    icon_192 = create_rms_icon(192)
    icon_512 = create_rms_icon(512)
    icon_maskable = create_rms_icon(512, is_maskable=True)
    icon_apple = create_rms_icon(180)

    icon_192.save(os.path.join(web_public, "icon-192.png"))
    icon_512.save(os.path.join(web_public, "icon-512.png"))
    icon_maskable.save(os.path.join(web_public, "maskable-icon.png"))
    icon_apple.save(os.path.join(web_public, "apple-touch-icon.png"))
    icon_192.save(os.path.join(web_public, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

    print("store-web PWA icons generated successfully.")

    # Generate store-management-system icons
    cms_192 = create_rms_icon(192, is_admin=True)
    cms_512 = create_rms_icon(512, is_admin=True)
    cms_maskable = create_rms_icon(512, is_maskable=True, is_admin=True)
    cms_apple = create_rms_icon(180, is_admin=True)

    cms_192.save(os.path.join(cms_public, "icon-192.png"))
    cms_512.save(os.path.join(cms_public, "icon-512.png"))
    cms_maskable.save(os.path.join(cms_public, "maskable-icon.png"))
    cms_apple.save(os.path.join(cms_public, "apple-touch-icon.png"))
    cms_192.save(os.path.join(cms_public, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

    print("store-management-system PWA icons generated successfully.")

if __name__ == "__main__":
    main()
