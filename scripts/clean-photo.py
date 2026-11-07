#!/usr/bin/env python3
"""Prepares a screenshot from the client's channel for the site: removes the black price
sticker and makes a square photo. Usage: clean-photo.py in.png out.webp [--no-sticker] [--crop=x0,x1]"""
import sys
import numpy as np
from PIL import Image, ImageFilter

SIZE = 1000


def find_sticker(g):
    """Largest box that is mostly black, has white text inside and is not black around it."""
    h, w = g.shape
    dark = np.zeros((h + 1, w + 1), np.int64)
    dark[1:, 1:] = (g < 40).cumsum(0).cumsum(1)
    light = np.zeros((h + 1, w + 1), np.int64)
    light[1:, 1:] = (g > 200).cumsum(0).cumsum(1)
    area = lambda t, x0, y0, x1, y1: t[y1, x1] - t[y0, x1] - t[y1, x0] + t[y0, x0]
    best, step = None, 6
    for bh in range(24, h // 3, step):
        for bw in range(bh + 20, min(w // 2, bh * 6), step):
            for y in range(4, h - bh - 4, step):
                for x in range(4, w - bw - 4, step):
                    size = bw * bh
                    d = area(dark, x, y, x + bw, y + bh)
                    if d < size * 0.6 or area(light, x, y, x + bw, y + bh) < size * 0.06:
                        continue
                    ring = area(dark, x - 4, y - 4, x + bw + 4, y + bh + 4) - d
                    if ring > (2 * (bw + bh) * 4) * 0.35:
                        continue
                    if best is None or size > best[0]:
                        best = (size, x, y, x + bw, y + bh)
    return best[1:] if best else None


def fill(a, box, pad=6):
    """Fills the box from its edges; the sticker sits on soft skin and blurred background."""
    x0, y0, x1, y1 = box
    h, w = a.shape[:2]
    x0, y0, x1, y1 = max(x0 - pad, 1), max(y0 - pad, 1), min(x1 + pad, w - 2), min(y1 + pad, h - 2)
    out = a.astype(np.float32).copy()
    # start from a blend of the top and bottom edges, the box is too big for smoothing alone
    t = np.linspace(0, 1, y1 - y0 + 3)[1:-1, None, None]
    out[y0:y1 + 1, x0:x1 + 1] = out[y0 - 1, x0:x1 + 1] * (1 - t) + out[y1 + 1, x0:x1 + 1] * t
    for _ in range(1500):
        out[y0:y1 + 1, x0:x1 + 1] = (out[y0 - 1:y1, x0:x1 + 1] + out[y0 + 1:y1 + 2, x0:x1 + 1]
                                     + out[y0:y1 + 1, x0 - 1:x1] + out[y0:y1 + 1, x0 + 1:x1 + 2]) / 4
    grain = np.random.default_rng(7).normal(0, 1.2, (y1 - y0 + 1, x1 - x0 + 1, 1))
    out[y0:y1 + 1, x0:x1 + 1] += grain
    return np.clip(out, 0, 255).astype(np.uint8)


def square(img):
    """Keeps the whole photo: the short side is extended with a blurred mirror of the edges."""
    w, h = img.size
    n = max(w, h)
    a = np.asarray(img)
    pad_y, pad_x = (n - h) // 2, (n - w) // 2
    wide = np.pad(a, ((pad_y, n - h - pad_y), (pad_x, n - w - pad_x), (0, 0)), mode='reflect')
    back = Image.fromarray(wide).filter(ImageFilter.GaussianBlur(n / 25))
    # the photo fades into the blurred edges so there is no visible seam
    fade = max(1, n // 12)
    ramp = lambda size, pad, length: np.clip((np.arange(size) - pad) / fade, 0, 1) * np.clip((pad + length - 1 - np.arange(size)) / fade, 0, 1)
    ys = ramp(n, pad_y, h) if pad_y else np.ones(n)
    xs = ramp(n, pad_x, w) if pad_x else np.ones(n)
    edge = np.outer(ys, xs)[..., None]
    return Image.fromarray((wide * edge + np.asarray(back) * (1 - edge)).astype(np.uint8))


def main():
    src, dst = sys.argv[1:3]
    img = Image.open(src).convert('RGB')
    a = np.asarray(img)
    if '--no-sticker' not in sys.argv:
        box = find_sticker(np.asarray(img.convert('L')))
        print('sticker', box)
        if box:
            a = fill(a, box)
    photo = Image.fromarray(a)
    crop = next((v[7:] for v in sys.argv if v.startswith('--crop=')), None)
    if crop:
        x0, x1 = map(int, crop.split(','))
        photo = photo.crop((x0, 0, x1, photo.height))
    out = square(photo).resize((SIZE, SIZE), Image.LANCZOS)
    out.filter(ImageFilter.UnsharpMask(radius=1.5, percent=60, threshold=2)).save(dst, 'WEBP', quality=88, method=6)


if __name__ == "__main__":
    main()
