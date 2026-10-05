#!/usr/bin/env python3
"""把 ImageGen 生成的「姿势表」切成本仓库规格的单张透明 WebP。

依赖：pip install pillow numpy

    # 核心 16 张 + 探头 3 张（A 表 4×5，第 20 格设定图在名字列表里写 -）
    python tools/slice-pose-sheet.py sheet-a.png --grid 4x5 --names tools/names-a.txt --out assets/zero
    # 生活插图（B 表 4×2，768 画布、质量 90 的有损 WebP）
    python tools/slice-pose-sheet.py sheet-b.png --grid 4x2 --names tools/names-b.txt --out assets/zero/life --fit scene --size 768 --lossy 90

规则从仓库现有绘梨衣素材量出：
- 普通姿势：384 画布，水平居中，脚底/坐姿底边在 95.8%。整张表用同一个缩放比例（以 --ref 指定的
  待机格高度对齐到 88.5%），这样每格头的大小一致；个别格子太宽时再单独缩到长边 91%。
- 探头：512 画布，edge-left 的切边贴在 17.8%，edge-right 贴在 86.1%，edge-bottom 底边在 92.8%。
- 场景（生活插图）：人物和道具一起放进 99%×90.5% 的框，底边在 95.5%。

每格按连通区域归属（区域中心落在哪一格就算哪一格），越界的头发、表情符号不会被邻格切掉，
邻格伸过来的部分也不会混进来。GPT 常给出“几乎透明”的脏背景，--alpha-floor 以下的透明度会被清零。
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
    parser.add_argument('--grid', help='列x行，例如 4x5')
    parser.add_argument('--names', required=True, help='每行一个文件名（不含扩展名），- 表示跳过该格')
    parser.add_argument('--out', required=True)
    parser.add_argument('--fit', choices=['pose', 'scene'], default='pose')
    parser.add_argument('--size', type=int, default=384, help='普通姿势或场景的画布边长')
    parser.add_argument('--edge-size', type=int, default=512, help='edge-* 探头图的画布边长')
    parser.add_argument('--ref', default='idle', help='统一缩放比例参照的格子名')
    parser.add_argument('--ref-height', type=float, default=REF_HEIGHT, help='参照格的高度占画布的比例（默认对齐绘梨衣待机图 0.885）')
    parser.add_argument('--lossy', type=int, help='改存有损 WebP 的质量（默认无损）')
    parser.add_argument('--png', action='store_true', help='同时存一份 PNG 方便检查')
    parser.add_argument('--alpha-floor', type=int, default=16)
    parser.add_argument('--alpha-solid', type=int, default=240)
    parser.add_argument('--chroma', help='没有透明通道时按此底色抠图，例如 00ff00')
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
            sys.exit('这张图没有透明通道。请让生成器输出真透明 PNG，或用 --chroma 指定纯色底。')
        rgba = np.array(image.convert('RGBA'))
    alpha = rgba[:, :, 3].astype(np.int32)
    alpha[alpha < args.alpha_floor] = 0
    alpha[alpha >= args.alpha_solid] = 255
    rgba[:, :, 3] = alpha.astype(np.uint8)
    return rgba


def label_components(mask):
    """按行程（每行连续的一段）做 8 邻域连通区域标记，比逐像素快两个数量级。"""
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
    """返回每格的全分辨率遮罩：属于该格的连通区域。

    分区只看较实的像素（透明度 ≥ 96），避免相邻两格被淡淡的描边光晕连成一片；
    之后把遮罩外扩几个像素，光晕和抗锯齿边缘仍会跟着自己的格子走。
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
        # 光晕外扩时不能吃进邻格：别人也够得着的像素，只留给紧贴自己的那一圈。
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
        sys.exit('请用 --grid 指定列数x行数，例如 --grid 4x5')
    columns, rows = (int(part) for part in args.grid.lower().split('x'))
    with open(args.names, encoding='utf-8') as handle:
        names = [line.strip() for line in handle if line.strip() and not line.startswith('#')]
    if len(names) != columns * rows:
        sys.exit(f'名字列表有 {len(names)} 项，但网格是 {columns * rows} 格。')
    rgba = load_sheet(args.sheet, args)
    masks = cell_masks(rgba, columns, rows)
    pieces = {}
    for index, name in enumerate(names):
        if name == '-':
            continue
        if index not in masks:
            sys.exit(f'第 {index + 1} 格（{name}）是空的。')
        pieces[name] = crop(rgba, masks[index])
    reference_scale = None
    if args.fit == 'pose' and args.ref in pieces:
        reference_scale = args.ref_height * args.size / pieces[args.ref].height
    for name, piece in pieces.items():
        board = normalize(name, piece, args, reference_scale)
        path = os.path.join(args.out, f'{name}.webp')
        save(board, path, args)
        print(f'{path}  原尺寸 {piece.width}x{piece.height}')


if __name__ == '__main__':
    main()
