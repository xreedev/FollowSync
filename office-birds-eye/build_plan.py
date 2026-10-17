import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle, Wedge, FancyBboxPatch, Polygon, Arc
import sys

W, H = 44, 44
fig = plt.figure(figsize=(17.6, 18.6), dpi=130)
ax = fig.add_axes([0.02, 0.02, 0.96, 0.90])
ax.set_xlim(0, W); ax.set_ylim(H, 0); ax.set_aspect("equal"); ax.axis("off")
fig.patch.set_facecolor("#14171c")

WALL="#e9ecef"; FLOOR_CARPET="#3c3a40"; FLOOR_TILE="#d9d6cf"; DESK="#f4f4f1"; CHAIR="#1d1f24"
ORANGE="#e8832a"; WOOD="#7a4a2d"; TEAL="#2fb5b8"; GLASS="#8fd3ff"

def R(x,y,w,h,fc,ec="none",lw=0,z=1,a=1,**k):
    ax.add_patch(Rectangle((x,y),w,h,fc=fc,ec=ec,lw=lw,zorder=z,alpha=a,**k))
def T(x,y,s,c="#dfe3e8",fs=10,w="normal",z=20,ha="center",va="center",**k):
    ax.text(x,y,s,color=c,fontsize=fs,fontweight=w,ha=ha,va=va,zorder=z,**k)
def wall(x1,y1,x2,y2,lw=5,c="#f1f3f5"):
    ax.plot([x1,x2],[y1,y2],color=c,lw=lw,solid_capstyle="projecting",zorder=8)
def door(x,y,w,horizontal=True,swing=1):
    if horizontal:
        R(x,y-0.2,w,0.4,"#14171c",z=9)
        ax.add_patch(Arc((x,y),2*w,2*w,theta1=0 if swing>0 else -90,theta2=90 if swing>0 else 0,color="#c9ced6",lw=1,zorder=9))
    else:
        R(x-0.2,y,0.4,w,"#14171c",z=9)
def chair(x,y,s=0.55):
    ax.add_patch(FancyBboxPatch((x-s/2,y-s/2),s,s,boxstyle="round,pad=0,rounding_size=0.15",fc=CHAIR,ec="#4a4e57",lw=0.6,zorder=6))
def plant(x,y,r=0.6):
    ax.add_patch(Circle((x,y),r,fc="#2c7a3f",ec="#1c5a2c",lw=1,zorder=7))
    ax.add_patch(Circle((x,y),r*0.45,fc="#49a65d",ec="none",zorder=7))

# ---------- ATRIUM (top) ----------
R(0,0,W,11,"#20252c",z=0)
R(3,0.8,38,6.7,"#c9a98a",z=1)                       # atrium floor far below
for i in range(9):
    cx=6+i*4.1; cy=3.2+(i%2)*1.9
    col=["#e0564f","#f0a23b","#d94a6a","#e8832a"][i%4]
    ax.add_patch(Circle((cx,cy),1.35,fc=col,ec="#7a2b24",lw=0.8,zorder=2))
    ax.add_patch(Circle((cx,cy),0.18,fc="#3a2a22",zorder=3))
    for a in range(0,360,45):
        import math
        ax.plot([cx,cx+1.35*math.cos(math.radians(a))],[cy,cy+1.35*math.sin(math.radians(a))],color="#7a2b24",lw=0.4,zorder=3)
# glass pyramid / feature
ax.add_patch(Polygon([[19.5,5],[22,2.2],[24.5,5]],fc="#bfe6ff",ec="#fff",lw=1,alpha=.75,zorder=4))
R(3,0.8,38,6.7,"none",ec="#f1f3f5",lw=2.2,z=5)
T(22,0.1,"ATRIUM VOID  (café court below, 7+ storeys)",c="#9aa3ad",fs=10,va="top")
# railing + walkway
R(1,7.5,42,3.5,FLOOR_TILE,z=1)
ax.plot([3,41],[7.6,7.6],color="#8d949d",lw=2,zorder=6)
for gx in range(3,42,1):
    ax.plot([gx,gx],[7.45,7.75],color="#8d949d",lw=0.6,zorder=6)
T(22,9.3,"WALKWAY / CORRIDOR  (monochrome-banded atrium facade)",c="#555a62",fs=10,w="bold")

# ---------- RECEPTION ----------
R(1,11,12,11,FLOOR_TILE,z=1)
R(1,11,12,0.35,WALL,z=2)
# logo wall (east)
R(12.55,11.4,0.5,10,"#ffffff",z=3)
pts=[[12.2,13],[11.6,14.6],[12.2,16.2],[11.4,18],[12.2,19.5]]
for i in range(len(pts)-1):
    ax.add_patch(Polygon([pts[i],pts[i+1],[12.95,pts[i+1][1]]],fc=[ORANGE,"#8a8f98","#f0b95e","#5c616a"][i%4],alpha=.9,zorder=4))
T(11.0,21.1,"SIMPLOGICS",c="#e8832a",fs=8,w="bold",rotation=90,ha="right")
# curved desk
ax.add_patch(Wedge((13,16),6.3,125,235,width=1.7,fc="#b9d9e6",ec="#6c8996",lw=1.2,zorder=5))
ax.add_patch(Wedge((13,16),6.3,125,235,width=0.6,fc="#7a8a92",ec="none",zorder=6))
R(10.0,15.4,1.0,1.1,"#0d0f12",z=7)   # monitor
chair(9.0,16.0)
T(6.2,16.8,"RECEPTION\nDESK",c="#33383f",fs=9,w="bold")
# lounge chairs + plant
for (x,y,r) in [(2.6,19.4,0),(4.6,20.4,0)]:
    ax.add_patch(FancyBboxPatch((x-0.9,y-0.65),1.8,1.3,boxstyle="round,pad=0,rounding_size=0.3",fc="#6d717a",ec="#44484f",lw=1,zorder=6))
plant(2.2,17.4)
door(7,11,2.0)              # main entrance from walkway
ax.annotate("", xy=(8,12.3), xytext=(8,10.3), arrowprops=dict(arrowstyle="-|>",color=ORANGE,lw=2.2),zorder=15)
T(8.4,10.0,"ENTRY",c=ORANGE,fs=9,w="bold",ha="left")
T(7,13.5,"Reception / Lobby",c="#33383f",fs=11,w="bold")
# door to bay (back of reception)
door(13,19.2,2.2,horizontal=False)

# ---------- OPEN-PLAN BAY ----------
R(13,11,31,21,FLOOR_CARPET,z=1)
for x in range(14,44,2):               # orange carpet striping
    ax.plot([x,x],[11,32],color="#6b4a38",lw=0.9,alpha=.8,zorder=2)
# ceiling feature outline (wood coffer)
R(23,20,8,3.2,"none",ec="#c9964b",lw=2.2,z=3,ls="--")
T(27,21.6,"ceiling feature\n(timber coffer + LED slats)",c="#c9964b",fs=7.5,style="italic")

# CEO cabin (glass)
R(13,11,8.5,7.5,"#4a3f3a",z=2)
R(13,11,8.5,7.5,"none",ec=GLASS,lw=3,z=9)
R(13.7,16.2,3.4,1.5,"#9aa0a8",z=6); R(13.7,14.6,1.5,1.7,"#9aa0a8",z=6)   # sofa
R(17,12.2,3.2,1.6,"#2b2f36",ec="#555",z=6)                              # exec desk
chair(18.6,14.3)
T(17.2,15.4,"CEO / MD\nCABIN",c="#f0b95e",fs=9,w="bold")
T(17.2,10.4,"",fs=1)

# desk clusters: double-sided benches with partitions
def bench(x,y,n=4,vertical=False):
    L=n*1.6
    if not vertical:
        R(x,y,L,1.5,DESK,ec="#b7b7b0",lw=0.7,z=4)
        R(x,y+0.72,L,0.08,"#9fc8c0",z=5)           # divider
        for i in range(n):
            R(x+i*1.6+0.35,y+0.1,0.9,0.5,"#16181c",z=6)        # monitors
            R(x+i*1.6+0.35,y+0.9,0.9,0.5,"#16181c",z=6)
            chair(x+i*1.6+0.8,y-0.55); chair(x+i*1.6+0.8,y+2.05)
    else:
        R(x,y,1.5,L,DESK,ec="#b7b7b0",lw=0.7,z=4)
        R(x+0.72,y,0.08,L,"#9fc8c0",z=5)
        for i in range(n):
            R(x+0.1,y+i*1.6+0.35,0.5,0.9,"#16181c",z=6)
            R(x+0.9,y+i*1.6+0.35,0.5,0.9,"#16181c",z=6)
            chair(x-0.55,y+i*1.6+0.8); chair(x+2.05,y+i*1.6+0.8)

# rows of benches (3 columns x 3 rows), leaving CEO cabin + ceiling feature clear
for (x,y) in [(24,13.2),(33,13.2),(24,17.0),(33,17.0)]:
    bench(x,y,n=5 if x==24 else 4)
for (x,y) in [(15,22),(15,26.5)]:
    bench(x,y,n=4)
for (x,y) in [(33,23.0),(33,27.0)]:
    bench(x,y,n=4)
bench(23,25.4,n=4)
# long window-side bench (foreground in frames 3/4)
bench(23,29.0,n=6)

# east wall windows w/ blinds
R(43.6,11,0.4,21,"#7e8794",z=7)
for y in range(12,31,2):
    R(43.35,y,0.65,1.5,"#b9c2cf",z=8)
T(42.2,21.5,"WINDOWS + ZEBRA BLINDS",c="#9aa3ad",fs=8,rotation=90)
# south-west feature wall (plants, timber panel, far door seen in frames 3-4)
R(13,31.4,8,0.7,WOOD,z=7)
for x in (13.5,15.5,17.5,19.5):
    plant(x,30.6,0.5)
door(21.5,32,1.6)
T(17,29.2,"timber slat feature wall,\nplanters + rear door",c="#c98e63",fs=7.5,style="italic")
# printer/pantry hint not shown in footage
T(38.5,31.0,"WORKSTATION BAY — open plan,\nwhite partitions, black task chairs",c="#c8ccd2",fs=9,w="bold")

# ---------- MEETING ROOMS ----------
# Boardroom A (TV room)
R(1,32,13,11,"#4a4540",z=1)
R(1,32,13,11,"none",ec="#f1f3f5",lw=3,z=9)
# table
ax.add_patch(FancyBboxPatch((4.2,36),7.2,3.2,boxstyle="round,pad=0,rounding_size=0.3",fc="#6c5546",ec="#3d2d23",lw=1.2,zorder=5))
for i in range(4):
    chair(5.2+i*1.7,35.1); chair(5.2+i*1.7,40.1)
chair(3.3,37.6); chair(12.3,37.6)
R(1.15,35.5,0.35,4.5,"#0d0f12",z=7)           # wall-mounted TV
T(2.9,34.0,"TV",c="#9aa3ad",fs=7.5)
R(13.4,34.5,0.4,5.5,"#f4f7fb",ec="#aab",lw=0.6,z=8)   # whiteboard
T(7.8,33.2,"BOARDROOM A  ·  8-seat",c="#f0b95e",fs=10,w="bold")
T(7.8,42.0,"wall TV (W) · glass whiteboard (E)",c="#aab0b8",fs=7.5,style="italic")
door(11.8,32,1.6)

# Meeting room B (lounge + whiteboard)
R(14,32,17,11,"#4a4540",z=1)
R(14,32,17,11,"none",ec="#f1f3f5",lw=3,z=9)
R(15.0,34.2,0.4,5.5,"#f4f7fb",ec="#aab",lw=0.6,z=8)   # whiteboard
ax.add_patch(FancyBboxPatch((17.6,36),7.6,3.2,boxstyle="round,pad=0,rounding_size=0.3",fc="#7a6556",ec="#3d2d23",lw=1.2,zorder=5))
for i in range(4):
    chair(18.6+i*1.8,35.1); chair(18.6+i*1.8,40.1)
chair(16.7,37.6)
# timber slat divider + teal lounge
R(26.4,32.4,0.9,5.2,WOOD,z=7)
for yy in range(0,5):
    ax.plot([26.4,27.3],[32.6+yy,32.6+yy],color="#4e2d1a",lw=0.7,zorder=8)
for (x,y,w,h) in [(28.2,33.2,2.0,1.1),(29.6,35.2,1.1,2.0)]:
    ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle="round,pad=0,rounding_size=0.25",fc=TEAL,ec="#1b7f82",lw=1,zorder=6))
ax.add_patch(Circle((28.8,34.9),0.35,fc="#fff",ec="#999",zorder=6))
plant(30.2,32.8,0.4)
T(21.5,33.2,"MEETING ROOM B  ·  table + teal lounge",c="#f0b95e",fs=10,w="bold")
door(22,43,1.6,swing=-1)

# not-in-footage areas
for (x,y,w,h,lab) in [(1,22,12,10,"NOT SHOWN IN FOOTAGE\n(circulation / support)"),(31,32,13,11,"NOT SHOWN IN FOOTAGE")]:
    R(x,y,w,h,"#20252c",ec="#3a414b",lw=1.2,z=1,hatch="///")
    T(x+w/2,y+h/2,lab,c="#6c7480",fs=9)

# outer walls
wall(1,11,1,43); wall(1,43,44,43); wall(44,11,44,43,lw=6)
wall(1,11,13,11); wall(13,11,44,11)
wall(13,11,13,19); wall(13,21.5,13,32)
wall(1,32,44,32,lw=4)

# ---------- legend, north arrow, scale, title ----------
T(0.4,-0.2,"",fs=1)
fig.text(0.03,0.965,"OFFICE — BIRD'S-EYE VIEW",color="#ffffff",fontsize=26,fontweight="bold",ha="left",va="top")
fig.text(0.03,0.935,"Reconstructed top-down plan from walkthrough video, 0:04–0:10  (6 source frames, perspective → plan)",color="#9aa3ad",fontsize=12.5,ha="left",va="top")
fig.text(0.97,0.965,"Layout is schematic. Proportions and desk counts are estimated\nfrom camera shots; areas not on camera are hatched.",color="#8a929c",fontsize=10.5,ha="right",va="top")
# north-arrow-like "camera path"
ax.annotate("",xy=(8,13),xytext=(8,9.2),arrowprops=dict(arrowstyle="-|>",color=ORANGE,lw=2.5),zorder=15)
ax.plot([8,8,27,27,22,17,9],[9.2,12.5,12.5,23.5,23.5,38,38],color=ORANGE,lw=0,zorder=0)
# scale bar
R(35,41.2,10*0.0+5,0.35,"#fff",z=20)
T(37.5,40.5,"≈ 5 m",c="#fff",fs=9)
fig.savefig(sys.argv[1],dpi=130,facecolor=fig.get_facecolor())
print("ok")
