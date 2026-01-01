
// 简单的游戏清单。新增游戏：在此添加一个对象即可。
window.GAMES = [
  {
    id: '2048',
    name: '2048',
    desc: '合并数字，冲击 2048！支持键盘与滑动手势。',
    cat: ['classic','puzzle'],
    tags: ['合并','休闲','纯前端'],
    src: 'games/2048/index.html',
    cover: { emoji: '🔢', bg: '#FEE2E2', fg: '#DC2626' },
    featured: true,
    addedAt: '2026-01-01',
    bestKey: 'best-2048' // 与游戏内 localStorage 键保持一致
  },
  {
    id: 'snake',
    name: '贪吃蛇',
    desc: '经典像素蛇，吃到食物就变长。支持方向键与虚拟按键。',
    cat: ['classic','action'],
    tags: ['像素','怀旧','键盘'],
    src: 'games/snake/index.html',
    cover: { emoji: '🐍', bg: '#DCFCE7', fg: '#16A34A' },
    featured: true,
    addedAt: '2026-01-01',
    bestKey: 'best-snake' // 预留
  },
  {
    id: 'tetris',
    name: '俄罗斯方块',
    desc: '下落方块，消除行数。支持轻量加速与旋转。',
    cat: ['classic','puzzle'],
    tags: ['下落','消除','键盘'],
    src: 'games/tetris/index.html',
    cover: { emoji: '🧩', bg: '#E0E7FF', fg: '#4F46E5' },
    featured: false,
    addedAt: '2026-01-01',
    bestKey: 'best-tetris'
  },
{
  id: 'brick',
  name: '打砖块',
  desc: '弹球打砖块，清屏挑战。',
  cat: ['classic','action'],
  tags: ['弹球','反应力'],
  src: 'games/brick/index.html',
  cover: { emoji:'🧱', bg:'#FFF7ED', fg:'#EA580C' },
  featured: true,
  addedAt: '2026-01-01',
  bestKey: 'best-brick' // 若你的游戏记录了最佳成绩，就填上对应键
}

];
