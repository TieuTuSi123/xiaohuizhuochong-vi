#!/usr/bin/env python3
"""Cắt "bảng tư thế" (pose sheet) do ImageGen tạo thành từng ảnh WebP trong suốt đơn lẻ theo quy chuẩn của kho lưu trữ này.

Thư viện phụ thuộc: pip install pillow numpy

    # 16 ảnh cốt lõi + 3 ảnh ló đầu (Bảng A 4×5, ô thứ 20 là ảnh thiết lập thì điền - trong danh sách tên)
    python tools/slice-pose-sheet.py sheet-a.png --grid 4x5 --names tools/names-a.txt --out assets/zero
    # Ảnh minh họa sinh hoạt (Bảng B 4×2, khung vẽ 768, WebP nén có suy hao chất lượng 90)
    python tools/slice-pose-sheet.py sheet-b.png --grid 4x2 --names tools/names-b.txt --out assets/zero/life --fit scene --size 768 --lossy 90

Quy tắc được đo đạc dựa trên tài nguyên Erii hiện có trong kho:
- Tư thế thường: Khung vẽ 384, căn giữa theo chiều ngang, mép dưới bàn chân/tư thế ngồi đặt ở mức 95.8%. Toàn bộ bảng dùng chung một tỷ lệ thu phóng (dựa trên ô chờ mặc định được chỉ định bởi --ref, căn chỉnh chiều cao đạt 88.5%), nhờ đó kích thước đầu ở mỗi ô sẽ đồng nhất; riêng những ô quá rộng sẽ được thu nhỏ độc lập theo cạnh dài về mức 91%.
- Ló đầu: Khung vẽ 512, đường cắt của edge-left đặt sát mức 17.8%, edge-right sát mức 86.1%, mép dưới của edge-bottom ở mức 92.8%.
- Bối cảnh (ảnh minh họa sinh hoạt): Nhân vật và đạo cụ cùng nằm gọn trong khung 99%×90.5%, mép dưới ở mức 95.5%.

Mỗi ô được xác định quyền sở hữu dựa trên vùng liên thông (trọng tâm vùng rơi vào ô nào thì tính cho ô đó). Phần tóc hay biểu cảm vượt ranh giới sẽ không bị ô bên cạnh cắt mất, phần thừa vươn sang từ ô bên cạnh cũng không bị lẫn vào. GPT thường sinh ra nền bẩn "gần như trong suốt", độ mờ đục dưới ngưỡng --alpha-floor sẽ bị xóa trắng hoàn toàn.
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image

FOOT = 0.958
LONG = 350 / 384
REF_HEIGHT = 340 / 384
EDGE_RULES = {
    'edge-left': {'side': 'left', 'line': 0.178, 'top': 0.045, 'bottom': 0.977},
    'edge-right': {'side': 'right', 'line': 0.861, 'top': 0.066, 'bottom': 0.977},
    'edge-bottom': {'side': 'bottom', 'line': 0.928, 'top': 0.096, 'width': 0.98},
}


def parse_args(argv):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('sheet')
    parser.add_argument('--grid', help='Cột x hàng, ví dụ: 4x5')
    parser.add_argument('--names', required=True, help='Mỗi dòng một tên tệp (không kèm đuôi file), dấu - biểu thị bỏ qua ô đó')
    parser.add_argument('--out', required=True)
    parser.add_argument('--fit', choices=['pose', 'scene'], default='pose')
    parser.add_argument('--size', type=int, default=384, help='Độ dài cạnh khung vẽ cho tư thế thường hoặc bối cảnh')
    parser.add_argument('--edge-size', type=int, default=512, help='Độ dài cạnh khung vẽ cho ảnh ló đầu edge-*')
    parser.add_argument('--ref', default='idle', help='Tên ô dùng làm mốc quy chuẩn tỷ lệ thu phóng đồng nhất')
    parser.add_argument('--ref-height', type=float, default=REF_HEIGHT, help='Tỷ lệ chiều cao ô mốc so với khung vẽ (mặc định căn theo ảnh chờ của Erii là 0.885)')
    parser.add_argument('--lossy', type=int, help='Chất lượng xuất WebP nén có suy hao (mặc định nén không suy hao)')
    parser.add_argument('--png', action='store_true', help='Lưu thêm một bản PNG để tiện kiểm tra')
    parser.add_argument('--alpha-floor', type=int, default=16)
    parser.add_argument('--alpha-solid', type=int, default=240)
    parser.add_argument('--chroma', help='Tách phông theo màu nền chỉ định khi ảnh không có kênh alpha, ví dụ: 00ff00')
    parser.add_argument('--tolerance', type=int, default=60)
    return parser.parse_args(argv)


def load_sheet(path, args):
    image = Image.open(path)
    if args.chroma:
        rgb = np.asarray(image.convert('RGB')).astype(np.int32)
        key = np.array([int(args.chroma[i:i + 2], 16) for i in (0, 2, 4)])
        distance = np.sqrt(((rgb - key) ** 2).sum(axis=2))
        alpha = np.clip((distance - args.tolerance) * 4, 0, 255).astype(np.uint8)
        rgba = np.dstack([rgb.astype(np.uint8), alpha])
    else:
        if image.mode not in ('RGBA', 'LA', 'PA') and 'transparency' not in image.info:
            sys.exit('Ảnh này không có kênh trong suốt. Vui lòng thiết lập bộ tạo xuất file PNG trong suốt thực sự, hoặc dùng --chroma để chỉ định màu nền.')
        rgba = np.array(image.convert('RGBA'))
    alpha = rgba[:, :, 3].astype(np.int32)
    alpha[alpha < args.alpha_floor] = 0
    alpha[alpha >= args.alpha_solid] = 255
    rgba[:, :, 3] = alpha.astype(np.uint8)
    return rgba


def label_components(mask):
    """Gán nhãn vùng liên thông lân cận 8 điểm theo từng đoạn chạy (run-length trên mỗi dòng liên tục), nhanh hơn duyệt từng pixel khoảng 2 bậc độ lớn."""
    height, width = mask.shape
    padded = np.zeros((height, width + 2), dtype=np.int8)
    padded[:, 1:-1] = mask
    edges = np.diff(padded, axis=1)
    runs = []  # (y, start, end_inclusive)
    for y in range(height):
        starts = np.flatnonzero(edges[y] == 1)
        ends = np.flatnonzero(edges[y] == -1) - 1
        runs.append(list(zip(starts.tolist(), ends.tolist())))
    parent = []

    def find(item):
        while parent[item] != item:
            parent[item] = parent[parent[item]]
            item = parent[item]
        return item

    ids, previous = [], []
    for y in range(height):
        current = []
        for start, end in runs[y]:
            index = len(parent)
            parent.append(index)
            for other, (p_start, p_end) in previous:
                if p_start <= end + 1 and p_end >= start - 1:
                    a, b = find(index), find(other)
                    if a != b:
                        parent[max(a, b)] = min(a, b)
            current.append((index, (start, end)))
        ids.append(current)
        previous = current
    labels = np.zeros((height, width), dtype=np.int32)
    for y, row in enumerate(ids):
        for index, (start, end) in row:
            labels[y, start:end + 1] = find(index) + 1
    return labels


def dilate(mask, steps):
    grown = mask.copy()
    for _ in range(steps):
        step = grown.copy()
        step[1:, :] |= grown[:-1, :]
        step[:-1, :] |= grown[1:, :]
        step[:, 1:] |= grown[:, :-1]
        step[:, :-1] |= grown[:, 1:]
        grown = step
    return grown


def cell_masks(rgba, columns, rows):
    """Trả về mặt nạ độ phân giải gốc cho từng ô: các vùng liên thông thuộc về ô đó.

    Việc phân vùng chỉ xét các điểm ảnh đặc (độ mờ đục ≥ 96), tránh tình trạng hai ô liền kề bị viền sáng mờ nối liền thành một khối;
    Sau đó mở rộng mặt nạ ra ngoài vài pixel, vệt sáng và mép khử răng cưa vẫn sẽ bám theo ô của chính nó.
    """
    height, width = rgba.shape[:2]
    factor = max(1, round(max(width, height) / 1024))
    small = rgba[::factor, ::factor, 3]
    mask = small >= 96
    labels = label_components(mask)
    cell_w, cell_h = width / columns, height / rows
    owners = {}
    for label in np.unique(labels):
        if label == 0:
            continue
        ys, xs = np.nonzero(labels == label)
        if len(xs) < 3 or small[ys, xs].max() < 128:
            continue
        cx, cy = xs.mean() * factor, ys.mean() * factor
        index = min(rows - 1, int(cy // cell_h)) * columns + min(columns - 1, int(cx // cell_w))
        owners.setdefault(index, []).append(label)
    masks = {}
    own = {index: np.isin(labels, members) for index, members in owners.items()}
    grown = {index: dilate(region, 3) for index, region in own.items()}
    cover = sum(region.astype(np.int32) for region in grown.values())
    for index, region in grown.items():
        # Khi viền sáng mở rộng không được lấn vào ô lân cận: vùng điểm ảnh mà các ô khác cũng chạm tới được thì chỉ giữ lại lớp bao quanh sát mép chính mình.
        contested = (cover - region.astype(np.int32)) > 0
        keep = region & ~(contested & ~dilate(own[index], 1))
        full = np.repeat(np.repeat(keep, factor, axis=0), factor, axis=1)[:height, :width]
        masks[index] = full & (rgba[:, :, 3] > 0)
    return masks


def crop(rgba, mask):
    ys, xs = np.nonzero(mask)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    piece = rgba[y0:y1, x0:x1].copy()
    piece[:, :, 3] = np.where(mask[y0:y1, x0:x1], piece[:, :, 3], 0)
    return Image.fromarray(piece, 'RGBA')


def place(piece, canvas, scale, left, top):
    size = (max(1, round(piece.width * scale)), max(1, round(piece.height * scale)))
    resized = piece.resize(size, Image.Resampling.LANCZOS)
    board = Image.new('RGBA', (canvas, canvas), (0, 0, 0, 0))
    board.alpha_composite(resized, (round(left), round(top)))
    return board


def normalize(name, piece, args, reference_scale):
    rule = EDGE_RULES.get(name)
    if rule:
        canvas = args.edge_size
        if rule['side'] == 'bottom':
            scale = min(rule['width'] * canvas / piece.width, (rule['line'] - rule['top']) * canvas / piece.height)
            left = (canvas - piece.width * scale) / 2
            top = rule['line'] * canvas - piece.height * scale
        else:
            room = (1 - rule['line']) if rule['side'] == 'left' else rule['line']
            scale = min((rule['bottom'] - rule['top']) * canvas / piece.height, (room - 0.01) * canvas / piece.width)
            width = piece.width * scale
            left = rule['line'] * canvas if rule['side'] == 'left' else rule['line'] * canvas - width
            top = rule['bottom'] * canvas - piece.height * scale
        return place(piece, canvas, scale, left, top)
    canvas = args.size
    if args.fit == 'scene':
        scale = min(0.99 * canvas / piece.width, 0.905 * canvas / piece.height)
        foot = 0.955
    else:
        scale = min(reference_scale or float('inf'), LONG * canvas / max(piece.width, piece.height))
        foot = FOOT
    left = (canvas - piece.width * scale) / 2
    top = foot * canvas - piece.height * scale
    return place(piece, canvas, scale, left, top)


def save(board, path, args):
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    if args.lossy:
        board.save(path, 'WEBP', quality=args.lossy, alpha_quality=100, method=6)
    else:
        board.save(path, 'WEBP', lossless=True, quality=100, method=6)
    if args.png:
        board.save(os.path.splitext(path)[0] + '.png')


def main(argv=None):
    args = parse_args(argv or sys.argv[1:])
    if not args.grid:
        sys.exit('Vui lòng dùng --grid để chỉ định số cột x số hàng, ví dụ: --grid 4x5')
    columns, rows = (int(part) for part in args.grid.lower().split('x'))
    with open(args.names, encoding='utf-8') as handle:
        names = [line.strip() for line in handle if line.strip() and not line.startswith('#')]
    if len(names) != columns * rows:
        sys.exit(f'Danh sách tên có {len(names)} mục, nhưng lưới định dạng có {columns * rows} ô.')
    rgba = load_sheet(args.sheet, args)
    masks = cell_masks(rgba, columns, rows)
    pieces = {}
    for index, name in enumerate(names):
        if name == '-':
            continue
        if index not in masks:
            sys.exit(f'Ô thứ {index + 1} ({name}) trống rỗng.')
        pieces[name] = crop(rgba, masks[index])
    reference_scale = None
    if args.fit == 'pose' and args.ref in pieces:
        reference_scale = args.ref_height * args.size / pieces[args.ref].height
    for name, piece in pieces.items():
        board = normalize(name, piece, args, reference_scale)
        path = os.path.join(args.out, f'{name}.webp')
        save(board, path, args)
        print(f'{path}  kích thước gốc {piece.width}x{piece.height}')


if __name__ == '__main__':
    main()