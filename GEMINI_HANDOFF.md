# 🎨 Gemini UI/UX Enhancement Task

## 📋 项目概述
Pokemon Team Lab - 专业级宝可梦战队分析工具
当前状态：基础功能完成，需要高级 UI/UX 优化

## 🎯 你的任务目标

参考这两个网站的设计和交互：
1. https://richi3f.github.io/pokemon-team-planner/plan/#rby
2. https://mypokemonteam.com/

### 核心需求：
1. **真实宝可梦图片展示** - 替换 emoji 为真实 sprites
2. **拖拽式团队构建** - 实现直观的拖放交互
3. **高级可视化** - 属性克制矩阵、雷达图
4. **流畅动画** - 添加过渡效果和微交互

---

## 📦 已完成的基础工作（Claude 完成）

### 1. 性能优化
- ✅ `analyzeTeam` 函数优化（18倍性能提升）
- ✅ 评分算法改进
- ✅ SE_TARGETS 预计算表

### 2. 数据准备
- ✅ Pokemon 接口已扩展：
```typescript
interface Pokemon {
  name: string;
  types: PokemonType[];
  sprite: string;  // emoji fallback
  id: number;
  generation: number;
  spriteUrl?: string;  // PokeAPI sprite URL
}
```

### 3. UI 基础
- ✅ Toast 通知组件
- ✅ Custom scrollbar 样式
- ✅ Type Lab 深色工业风主题
- ✅ 18 个属性的动态路由

---

## 🎨 你需要实现的功能

### Priority 1: 图片集成 ⭐⭐⭐

**目标：** 将 emoji 替换为真实的宝可梦 sprites

**实现要点：**
- 使用 `pokemon.spriteUrl` 字段（已预填充 PokeAPI URLs）
- 添加图片加载状态（skeleton/loading）
- 图片加载失败时回退到 emoji
- 优化图片尺寸和加载性能

**参考组件位置：**
- `src/app/page.tsx` - `PokemonCard` 组件（第 33 行）
- `src/app/page.tsx` - `PokemonSearch` 组件（第 41 行）

**示例代码：**
```tsx
<Image
  src={pokemon.spriteUrl || '/fallback.png'}
  alt={pokemon.name}
  width={96}
  height={96}
  onError={(e) => e.target.src = pokemon.sprite} // fallback to emoji
/>
```

---

### Priority 2: 拖拽交互 ⭐⭐⭐

**目标：** 实现类似 mypokemonteam.com 的拖拽式团队构建

**功能需求：**
- 从搜索结果拖拽宝可梦到团队槽位
- 团队内部重新排序
- 拖拽移除（拖到外部删除）
- 视觉反馈（拖拽时的阴影、高亮）

**推荐库：**
- `@dnd-kit/core` (轻量级，性能好)
- 或 `react-beautiful-dnd`

**关键文件：**
- `src/app/page.tsx` - 主组件（第 189 行）

---

### Priority 3: 高级可视化 ⭐⭐

**目标：** 改进属性克制关系的展示方式

**需要实现：**

1. **属性克制矩阵热力图**
   - 参考 richi3f 的矩阵设计
   - 颜色编码：红色=弱点，绿色=抗性，灰色=免疫
   - 悬停显示详细倍率

2. **团队评分雷达图**
   - 维度：覆盖率、防御、平衡、协同
   - 使用 `recharts` 或 `chart.js`

3. **属性分布饼图**
   - 显示团队的属性组成

**关键文件：**
- `src/app/page.tsx` - `AnalysisPanel` 组件（第 90 行）
- 当前的 Defensive Matrix（第 159-177 行）需要升级

---

### Priority 4: 动画与微交互 ⭐

**目标：** 提升整体交互体验

**需要添加：**
- 宝可梦卡片的悬停放大效果
- 添加/移除宝可梦的淡入淡出动画
- 分析结果的渐进式展示
- 属性标签的脉冲效果（弱点警告）

**推荐方案：**
- Framer Motion（已有 Tailwind 动画基础）
- CSS transitions（保持轻量）

---

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx          # 主页面（你的主战场）
│   ├── globals.css       # 全局样式（Type Lab 主题）
│   └── types/[slug]/     # 属性详情页
├── lib/
│   ├── pokemon.ts        # 核心数据和逻辑
│   └── content.ts        # 内容生成系统
```

---

## 🎨 设计规范

### 颜色系统（Type Lab 主题）
```css
--background: #0f172a    /* 深色背景 */
--panel: #1e293b         /* 卡片背景 */
--accent: #38bdf8        /* 极光蓝（行动色） */
--panel-border: #334155  /* 边框 */
```

### 组件类名
- `.lab-card` - 磨砂玻璃卡片
- `.lab-button` - 主要按钮
- `.type-chip` - 属性标签
- `.custom-scrollbar` - 自定义滚动条

---

## 🚀 开始工作

### 1. 安装依赖（如需要）
```bash
npm install @dnd-kit/core @dnd-kit/sortable
npm install recharts
npm install framer-motion
```

### 2. 优先级顺序
1. 先做图片集成（最直观的提升）
2. 再做拖拽交互（核心体验）
3. 然后做可视化（数据展示）
4. 最后润色动画（锦上添花）

### 3. 注意事项
- 保持 Type Lab 的深色工业风格
- 所有改动要响应式（移动端友好）
- 图片加载要有 fallback
- 性能优先（避免过度动画）

---

## 📞 与 Claude 的协作

**Claude 已完成：**
- ✅ 数据层优化
- ✅ 评分算法
- ✅ 内容架构
- ✅ 基础 UI 框架

**你负责：**
- 🎨 视觉升级
- 🖱️ 交互优化
- 📊 数据可视化
- ✨ 动画效果

**如果遇到数据/逻辑问题：**
- 检查 `src/lib/pokemon.ts` 的 `analyzeTeam` 函数
- 所有宝可梦数据在 `POKEMON_DB` 数组
- 属性克制关系在 `E` 对象（effectiveness chart）

---

## 🎯 成功标准

完成后，用户应该能够：
1. ✅ 看到真实的宝可梦图片（不是 emoji）
2. ✅ 通过拖拽快速构建团队
3. ✅ 通过可视化图表理解团队优劣
4. ✅ 享受流畅的动画和交互

---

## 📸 参考截图位置

请参考这两个网站的设计：
- **richi3f**: 属性矩阵、世代筛选、简洁布局
- **mypokemonteam**: 拖拽交互、图片展示、现代设计

---

祝你开发顺利！有任何问题随时沟通。🚀
