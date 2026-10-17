import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, FancyBboxPatch, Circle
import sys

fig, ax = plt.subplots(figsize=(15, 7), dpi=140)
ax.set_xlim(95, 1310); ax.set_ylim(630, 30); ax.set_aspect("equal"); ax.axis("off")

def room(x1, y1, x2, y2, label, fc="#ffffff", ec="#3b4350", fs=11, ly=None, rot=0, z=2):
    ax.add_patch(Rectangle((x1, y1), x2-x1, y2-y1, fc=fc, ec=ec, lw=2, zorder=z))
    if label:
        ax.text((x1+x2)/2, ly if ly else (y1+y2)/2, label, ha="center", va="center",
                fontsize=fs, fontweight="bold", color="#2b3039", rotation=rot, zorder=20)

def desk(x, y, w, h):
    ax.add_patch(Rectangle((x, y), w, h, fc="#eceff3", ec="#8c95a3", lw=1, zorder=5))
def chair(x, y, r=6):
    ax.add_patch(Circle((x, y), r, fc="#4a5160", ec="none", zorder=6))

FLOOR, ROOM, WOOD = "#f3efe6", "#ffffff", "#c8a77f"

# floor + balcony
room(196, 108, 1295, 608, "", fc=FLOOR, ec="#3b4350", z=1)
room(196, 46, 1290, 104, "BALCONY", fc="#dcebd5", fs=12)
for x in list(range(230, 600, 70))+list(range(900, 1270, 70)):
    ax.add_patch(Circle((x, 75), 9, fc="#6fae6a", ec="#3f7f3b", zorder=5))

# service rooms
room(113, 125, 190, 190, "BATH-\nROOM", fc="#dfe9f2", fs=8)
room(113, 206, 190, 611, "PANTRY", fc="#f6e7cf", rot=90)
for y in (230, 280, 520, 565):                       # counters
    desk(154, y, 28, 36)

# MR2 / MR1 (stacked)
for (y1, y2, lab, ty) in [(115, 220, "MR 2", 130), (220, 345, "MR 1", 236)]:
    room(320, y1, 439, y2, lab, fc=ROOM, ly=ty)
    cy = (y1+y2)/2 + 10
    ax.add_patch(FancyBboxPatch((350, cy-14), 58, 28, boxstyle="round,pad=0,rounding_size=6", fc=WOOD, ec="#8a6a43", zorder=5))
    for dx in (360, 380, 400):
        chair(dx, cy-24); chair(dx, cy+24)

# SOFA
room(644, 130, 788, 166, "SOFA", fc="#cfe0f5", fs=10)

# CEO room
room(860, 115, 982, 212, "CEO\nROOM", fc=ROOM, ly=135)
for cx in (891, 951):
    desk(cx-24, 160, 48, 26); chair(cx, 198)

# meeting rooms 4 & 3
room(1005, 117, 1289, 216, "MEETING ROOM 4", fc=ROOM, ly=127)
ax.add_patch(FancyBboxPatch((1060, 160), 170, 30, boxstyle="round,pad=0,rounding_size=8", fc=WOOD, ec="#8a6a43", zorder=5))
for dx in range(1075, 1230, 30):
    chair(dx, 152); chair(dx, 198)
room(1184, 218, 1290, 403, "MEETING\nROOM 3", fc=ROOM, ly=240)
ax.add_patch(FancyBboxPatch((1215, 275), 44, 100, boxstyle="round,pad=0,rounding_size=8", fc=WOOD, ec="#8a6a43", zorder=5))
for dy in (290, 325, 360):
    chair(1203, dy); chair(1272, dy)

# HR dept
room(866, 292, 1017, 579, "HR DEPT", fc=ROOM, ly=312)
for r in range(4):
    for c in range(2):
        x = 885 + c*68; y = 345 + r*58
        desk(x, y, 46, 24); chair(x+23, y+36)

# welcome desk
room(1133, 500, 1281, 567, "WELCOME\nDESK", fc="#fbe9cf", fs=10)

# sick room
room(210, 380, 287, 604, "SICK\nROOM", fc="#f9dede", ly=410, fs=10)
ax.add_patch(Rectangle((222, 470), 52, 110, fc="#fff", ec="#c98d8d", lw=1.5, zorder=5))

# bays: 5 people, one side only
def bay(x1, x2, y1, y2, label, fs=11):
    room(x1, y1, x2, y2, "", fc=ROOM)
    ax.text((x1+x2)/2, y1+(20 if "\n" in label else 14), label, ha="center", va="center",
            fontsize=fs, fontweight="bold", color="#2b3039", zorder=20)
    w = min(28, x2-x1-26)
    for i in range(5):
        y = y1 + 38 + i*37
        desk(x1+18, y, w, 30); chair(x1+9, y+15, 5)
bay(512, 573, 111, 342, "BAY 1")
bay(305, 343, 381, 607, "BAY\n6", fs=8)
bay(391, 452, 380, 608, "BAY 5")
bay(489, 550, 375, 607, "BAY 4")
bay(593, 654, 375, 607, "BAY 3")
bay(703, 764, 376, 606, "BAY 2")

ax.text(745, 618, "Schematic top-down plan, not to scale",
        ha="center", va="center", fontsize=9, color="#6b7380")
fig.savefig(sys.argv[1], dpi=140, facecolor="white", bbox_inches="tight", pad_inches=0.2)
