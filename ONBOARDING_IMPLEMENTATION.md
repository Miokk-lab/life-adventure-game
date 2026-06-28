# 三层新手引导系统 & 帮助中心 - 实现指南

## 📋 已创建的文件

### 1. 类型定义
- `src/types/onboarding.ts` - 所有类型定义

### 2. 状态管理
- `src/stores/onboardingStore.ts` - Zustand store，用于管理引导状态

### 3. 配置文件
- `src/data/helpContent.ts` - 所有帮助内容和提示配置

### 4. 组件
- `src/components/onboarding/OnboardingTipPrimary.tsx` - 一级提示组件（全屏弹窗）
- `src/components/onboarding/OnboardingTipSecondary.tsx` - 二级提示组件（浮动框）
- `src/components/onboarding/OnboardingTipTertiary.tsx` - 三级提示组件（问号图标）
- `src/components/onboarding/OnboardingTip.css` - 所有提示的样式
- `src/components/onboarding/OnboardingTipManager.tsx` - 提示管理器和Hook
- `src/components/pages/HelpCenterPage.tsx` - 帮助中心页面
- `src/components/pages/HelpCenterPage.css` - 帮助中心样式

### 5. Hooks
- `src/hooks/useMenuHelp.ts` - 菜单帮助相关的Hook

---

## 🚀 快速集成步骤

### 步骤 1: 在 App.tsx 中初始化 Onboarding

```tsx
import { useEffect } from 'react';
import { useOnboarding } from './stores/onboardingStore';

function App() {
  const { initializeProgress } = useOnboarding();

  useEffect(() => {
    // 初始化用户的引导进度
    const userId = localStorage.getItem('userId') || 'anonymous';
    initializeProgress(userId);
  }, [initializeProgress]);

  return (
    // ... 你的应用内容
  );
}
```

### 步骤 2: 在主布局中添加提示管理器

```tsx
import { OnboardingTipManager } from './components/onboarding/OnboardingTipManager';

export const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      {/* 应用内容 */}
      <YourAppContent />

      {/* 在最后添加提示管理器 */}
      <OnboardingTipManager />
    </div>
  );
};
```

### 步骤 3: 在路由中添加帮助中心页面

```tsx
import { HelpCenterPage } from './components/pages/HelpCenterPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function AppRoutes() {
  return (
    <Routes>
      {/* 其他路由 */}
      <Route path="/help" element={<HelpCenterPage />} />
    </Routes>
  );
}
```

### 步骤 4: 在菜单项中添加三级提示

```tsx
import { useHelpTip } from '../hooks/useMenuHelp';
import { OnboardingTipTertiary } from '../components/onboarding/OnboardingTipTertiary';

export const MenuItem: React.FC<{ id: string; label: string }> = ({ id, label }) => {
  const { tip, shouldShow } = useHelpTip(`menu_${id}`);

  return (
    <div className="menu-item">
      <span>{label}</span>
      {shouldShow && tip && (
        <OnboardingTipTertiary tip={tip} />
      )}
    </div>
  );
};
```

### 步骤 5: 在关键页面触发提示

```tsx
import { useOnboarding } from '../stores/onboardingStore';

export const BattlePage: React.FC = () => {
  const { markStepComplete } = useOnboarding();

  useEffect(() => {
    // 第一次进入战斗页面时
    markStepComplete('battle_tutorial');
  }, [markStepComplete]);

  return (
    <div>
      {/* 战斗内容 */}
    </div>
  );
};
```

---

## 🎨 提示的三个级别

### 一级提示 (Primary)
- **用途**: 极其重要的概念说明
- **触发**: 自动或必须看
- **样式**: 全屏半透明遮罩 + 居中弹窗
- **可关闭**: 是
- **适用场景**: 首次进入游戏、重大功能更新

```tsx
<OnboardingTipManager triggerId="battle_intro" />
```

### 二级提示 (Secondary)
- **用途**: 重要功能的补充说明
- **触发**: 自动显示或用户激活
- **样式**: 浮动框，带箭头指向目标
- **可关闭**: 是
- **适用场景**: 首次进入某个模块

```tsx
<OnboardingTipManager 
  triggerId="menu_tea_house" 
  position="bottom"
/>
```

### 三级提示 (Tertiary)
- **用途**: 可选的详细信息
- **触发**: 用户点击 [?] 图标
- **样式**: 小的 [?] 图标，点击显示小弹窗
- **可关闭**: 是
- **适用场景**: 每个菜单项旁边、按钮旁边

```tsx
import { useHelpTip } from '../hooks/useMenuHelp';
import { OnboardingTipTertiary } from '../components/onboarding/OnboardingTipTertiary';

const { tip, shouldShow } = useHelpTip('menu_hero_panel');
if (shouldShow && tip) {
  <OnboardingTipTertiary tip={tip} />
}
```

---

## 🎯 添加新的提示

### 1. 在 `src/data/helpContent.ts` 中添加配置

```typescript
// TIPS_CONFIG 中添加
menu_new_feature: {
  id: 'menu_new_feature',
  level: 'secondary' as const,
  title: '新功能标题',
  description: '这是新功能的说明...',
  trigger: 'auto' as const,
  dismissible: true,
}
```

### 2. 在组件中使用

```tsx
<OnboardingTipManager triggerId="menu_new_feature" />
```

---

## 📖 添加新的帮助文章

### 在 `src/data/helpContent.ts` 中添加

```typescript
HELP_ARTICLES.push({
  id: 'new_article_id',
  title: '文章标题',
  category: 'gameplay', // 或其他分类
  content: `文章内容...`,
  estimatedReadTime: 5,
  relatedTopics: ['other_article_id'],
});
```

---

## 🔧 在菜单中显示帮助图标

### 例子：侧边栏菜单

```tsx
import { useHelpTip } from '../hooks/useMenuHelp';
import { OnboardingTipTertiary } from '../components/onboarding/OnboardingTipTertiary';
import { TIPS_CONFIG } from '../data/helpContent';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { id: 'hero_panel', label: '英雄面板', helpTipId: 'menu_hero_panel' },
    { id: 'daily_quests', label: '日常任务', helpTipId: 'menu_daily_quests' },
    { id: 'battle_log', label: '战斗日志', helpTipId: 'menu_battle_log' },
    { id: 'tea_house', label: '花茶坊', helpTipId: 'menu_tea_house' },
  ];

  return (
    <aside className="sidebar">
      {menuItems.map((item) => {
        const tipConfig = Object.values(TIPS_CONFIG).find(
          (tip) => tip.id === item.helpTipId
        );
        return (
          <div key={item.id} className="menu-item">
            <span>{item.label}</span>
            {tipConfig && <OnboardingTipTertiary tip={tipConfig as any} />}
          </div>
        );
      })}
    </aside>
  );
};
```

---

## 📊 跟踪引导进度

### 查看用户是否完成了引导

```tsx
import { useOnboarding } from '../stores/onboardingStore';

export const Component: React.FC = () => {
  const { progress, completedSteps } = useOnboarding();

  const isStoryComplete = progress.completedStory;
  const hasDoneFirstBattle = completedSteps.includes('first_battle_complete');
  const hasSkippedTip = progress.skipedTips.includes('menu_tea_house');

  return (
    <div>
      {!isStoryComplete && <WelcomeMessage />}
      {hasDoneFirstBattle && <CongratulationsMessage />}
    </div>
  );
};
```

### 标记步骤完成

```tsx
const { markStepComplete } = useOnboarding();

// 用户完成第一个任务时
markStepComplete('first_quest_complete');

// 用户赢了第一场战斗时
markStepComplete('first_battle_complete');

// 用户制作了第一个花茶时
markStepComplete('first_tea_made');
```

---

## 🎛️ 用户偏好设置

### 允许用户控制提示显示

```tsx
import { useOnboarding } from '../stores/onboardingStore';

export const PreferencesPanel: React.FC = () => {
  const { preferences, setTipLevel, toggleTips } = useOnboarding();

  return (
    <div className="preferences">
      <label>
        <input
          type="checkbox"
          checked={preferences.showTips}
          onChange={(e) => toggleTips(e.target.checked)}
        />
        显示新手提示
      </label>

      <select
        value={preferences.tipLevel}
        onChange={(e) => setTipLevel(e.target.value as any)}
      >
        <option value="all">显示所有提示</option>
        <option value="important_only">仅显示重要提示</option>
        <option value="none">不显示提示</option>
      </select>
    </div>
  );
};
```

---

## 📱 响应式设计

所有提示和帮助中心都已配置为响应式设计，在移动设备上也能正常工作。

### 测试清单
- [ ] 在手机上查看提示
- [ ] 在平板上查看帮助中心
- [ ] 测试触摸交互
- [ ] 验证字体大小和间距

---

## 🧪 测试指南

### 测试提示显示

```typescript
// 在浏览器控制台中测试
const { useOnboarding } = require('./stores/onboardingStore');

// 显示特定提示
useOnboarding.setState((state) => ({
  visibleTips: ['menu_hero_panel']
}));

// 重置所有提示
useOnboarding.getState().resetOnboarding();
```

### 测试帮助中心

1. 导航到 `/help` 路由
2. 测试搜索功能
3. 测试分类过滤
4. 点击文章查看详情
5. 测试相关文章链接
6. 测试返回按钮

---

## 🔄 状态持久化

引导状态会自动保存到 `localStorage` 中，使用的键为 `onboarding-store`。

### 清除已保存的状态

```typescript
localStorage.removeItem('onboarding-store');
```

### 导出用户的引导进度

```typescript
const { progress } = useOnboarding();
const data = JSON.stringify(progress);
// 可以用于分析或支持
```

---

## 🐛 常见问题

### Q: 提示不显示
A: 检查以下几点：
1. 确保 `OnboardingTipManager` 已添加到根布局中
2. 检查 `preferences.showTips` 是否为 `true`
3. 检查提示是否已被用户关闭（在 `skipedTips` 中）
4. 在浏览器控制台中查看警告

### Q: 如何让提示不显示给已完成引导的用户
A: 
```tsx
const { progress } = useOnboarding();
if (progress.completedStory) {
  // 不显示引导提示
  return <Component />;
}
```

### Q: 如何重置用户的引导进度
A:
```tsx
const { resetOnboarding } = useOnboarding();
resetOnboarding(); // 重置并清除所有提示记录
```

---

## 📈 分析集成

### 跟踪用户交互

```typescript
const { dismissTip, markStepComplete } = useOnboarding();

// 用户关闭提示时
dismissTip('menu_hero_panel');
// 在这里可以发送分析事件

// 用户完成步骤时
markStepComplete('first_quest_complete');
// 在这里可以发送分析事件
```

---

## 🎓 最佳实践

1. **渐进式披露**: 不要一次性显示太多提示
2. **尊重用户**: 提供关闭提示的选项
3. **清晰简洁**: 提示文字应该简短且易于理解
4. **上下文相关**: 提示应该在用户需要时显示
5. **一致性**: 所有提示使用相同的样式和语调
6. **可访问性**: 确保提示对屏幕阅读器友好

---

## 📞 支持

如有问题，请参考：
- 帮助中心页面的文章
- 提示中的说明文字
- 代码注释和类型定义

---

## 📝 更新日志

### v1.0.0 (2024)
- ✅ 三层提示系统完成
- ✅ 帮助中心页面完成
- ✅ 状态管理集成
- ✅ 响应式设计
- ✅ 文档完成
