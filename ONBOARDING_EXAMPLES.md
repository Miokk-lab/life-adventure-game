# 三层新手引导系统 - 使用示例

## 🎯 完整示例：在游戏中集成引导系统

### 示例 1: 初始化应用

```tsx
// src/App.tsx
import { useEffect } from 'react';
import { useOnboarding } from './stores/onboardingStore';
import { OnboardingTipManager } from './components/onboarding';
import Router from './pages/Router';

export function App() {
  const { initializeProgress } = useOnboarding();

  useEffect(() => {
    // 从本地存储或API获取用户ID
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    initializeProgress(userId);
    localStorage.setItem('userId', userId);
  }, [initializeProgress]);

  return (
    <div className="app">
      <Router />
      {/* 在整个应用的最后添加提示管理器 */}
      <OnboardingTipManager />
    </div>
  );
}
```

### 示例 2: 主菜单界面

```tsx
// src/components/MainMenu.tsx
import { useOnboarding } from '../stores/onboardingStore';
import { OnboardingTipTertiary } from '../components/onboarding';
import { TIPS_CONFIG } from '../data/helpContent';
import './MainMenu.css';

export const MainMenu: React.FC = () => {
  const { progress } = useOnboarding();

  const menuItems = [
    {
      id: 'hero_panel',
      label: '👤 英雄面板',
      description: '查看你的英雄信息',
      tipId: 'menu_hero_panel',
      path: '/hero',
    },
    {
      id: 'daily_quests',
      label: '📋 日常任务',
      description: '完成任务帮助英雄成长',
      tipId: 'menu_daily_quests',
      path: '/quests',
    },
    {
      id: 'battle',
      label: '⚔️ 开始战斗',
      description: '与心魔对战',
      tipId: 'menu_battle',
      path: '/battle',
    },
    {
      id: 'tea_house',
      label: '🍵 花茶坊',
      description: '制作和品饮花茶',
      tipId: 'menu_tea_house',
      path: '/teahouse',
    },
  ];

  return (
    <nav className="main-menu">
      <h1>心岛冒险</h1>
      <div className="menu-grid">
        {menuItems.map((item) => {
          const tip = Object.values(TIPS_CONFIG).find((t) => t.id === item.tipId);
          const isTipDismissed = progress.skipedTips.includes(item.tipId);

          return (
            <a
              key={item.id}
              href={item.path}
              className="menu-item"
            >
              <div className="item-content">
                <h2>{item.label}</h2>
                <p>{item.description}</p>
              </div>

              {/* 显示帮助图标 */}
              {tip && !isTipDismissed && (
                <OnboardingTipTertiary tip={tip} />
              )}

              <span className="item-arrow">→</span>
            </a>
          );
        })}
      </div>

      {/* 帮助和设置 */}
      <div className="menu-footer">
        <a href="/help" className="btn-secondary">
          ℹ️ 帮助中心
        </a>
        <a href="/settings" className="btn-secondary">
          ⚙️ 设置
        </a>
      </div>
    </nav>
  );
};
```

### 示例 3: 日常任务页面

```tsx
// src/components/pages/QuestPage.tsx
import { useEffect } from 'react';
import { useOnboarding } from '../../stores/onboardingStore';
import { OnboardingTipManager } from '../../components/onboarding';

export const QuestPage: React.FC = () => {
  const { markStepComplete, progress } = useOnboarding();
  const isFirstVisit = !progress.firstTimeViews.tasks;

  useEffect(() => {
    // 标记首次访问任务页面
    if (isFirstVisit) {
      markStepComplete('tasks_tutorial');
    }
  }, [isFirstVisit, markStepComplete]);

  const handleQuestComplete = (questId: string) => {
    // 完成任务的逻辑
    console.log('Quest completed:', questId);

    // 第一次完成任务时标记
    if (progress.completedSteps.length === 0) {
      markStepComplete('first_quest_complete');
    }
  };

  return (
    <div className="quest-page">
      <h1>📋 日常任务</h1>

      {/* 首次访问时显示任务提示 */}
      {isFirstVisit && (
        <OnboardingTipManager
          triggerId="first_quest"
          position="top"
        />
      )}

      {/* 任务列表 */}
      <div className="quests-list">
        {/* 任务组件会调用 handleQuestComplete */}
      </div>
    </div>
  );
};
```

### 示例 4: 战斗页面

```tsx
// src/components/pages/BattlePage.tsx
import { useEffect } from 'react';
import { useOnboarding } from '../../stores/onboardingStore';
import { OnboardingTipManager } from '../../components/onboarding';
import { TIPS_CONFIG } from '../../data/helpContent';

export const BattlePage: React.FC = () => {
  const { markStepComplete, progress } = useOnboarding();
  const isFirstBattle = !progress.completedSteps.includes('first_battle_complete');

  useEffect(() => {
    // 首次进入战斗页面时标记
    markStepComplete('battle_tutorial');
  }, [markStepComplete]);

  const handleBattleWin = () => {
    // 战斗胜利逻辑
    if (isFirstBattle) {
      markStepComplete('first_battle_complete');
      // 显示庆祝提示
    }
  };

  return (
    <div className="battle-page">
      {/* 首次进入时显示战斗说明 */}
      {isFirstBattle && (
        <OnboardingTipManager
          triggerId="battle_intro"
          onTipDismissed={() => console.log('Battle tip dismissed')}
        />
      )}

      {/* 战斗UI */}
      <div className="battle-container">
        {/* 战斗逻辑 */}
      </div>

      {/* 首次胜利时显示庆祝 */}
      {isFirstBattle && progress.completedSteps.includes('first_battle_complete') && (
        <div className="victory-celebration">
          <h2>🎉 祝贺你赢得了第一场战斗！</h2>
          <p>你已经开始理解心魔了。继续加油！</p>
        </div>
      )}
    </div>
  );
};
```

### 示例 5: 花茶坊页面

```tsx
// src/components/pages/TeaHousePage.tsx
import { useEffect } from 'react';
import { useOnboarding } from '../../stores/onboardingStore';
import { OnboardingTipManager } from '../../components/onboarding';

export const TeaHousePage: React.FC = () => {
  const { markStepComplete, progress } = useOnboarding();
  const isFirstVisit = !progress.firstTimeViews.teaHouse;
  const isFirstTea = !progress.completedSteps.includes('first_tea_made');

  useEffect(() => {
    // 标记首次访问
    if (isFirstVisit) {
      markStepComplete('tasks_tutorial'); // 重用或创建新的
    }
  }, [isFirstVisit, markStepComplete]);

  const handleTeaCraft = (recipe: string) => {
    // 花茶制作逻辑
    console.log('Tea crafted:', recipe);

    // 第一次制作花茶时标记
    if (isFirstTea) {
      markStepComplete('first_tea_made');
    }
  };

  return (
    <div className="tea-house-page">
      <h1>🍵 花茶坊</h1>

      {/* 首次访问时显示花茶提示 */}
      {isFirstVisit && (
        <OnboardingTipManager
          triggerId="tea_craft"
          position="bottom"
        />
      )}

      {/* 花茶选择界面 */}
      <div className="tea-selection">
        {/* 花茶列表 */}
      </div>

      {/* 首次制作花茶的祝贺 */}
      {isFirstTea && progress.completedSteps.includes('first_tea_made') && (
        <div className="tea-celebration">
          <p>🌸 你制作了你的第一杯花茶！</p>
          <p>这是一个自我照顾的开始。</p>
        </div>
      )}
    </div>
  );
};
```

### 示例 6: 帮助中心页面

```tsx
// src/App.tsx 中的路由设置
import { HelpCenterPage } from './components/pages/HelpCenterPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/help" element={<HelpCenterPage />} />
        {/* 其他路由 */}
      </Routes>
    </BrowserRouter>
  );
}
```

### 示例 7: 设置面板

```tsx
// src/components/SettingsPanel.tsx
import { useOnboarding } from '../stores/onboardingStore';
import './SettingsPanel.css';

export const SettingsPanel: React.FC = () => {
  const { preferences, setTipLevel, toggleTips, resetOnboarding } = useOnboarding();

  return (
    <div className="settings-panel">
      <h2>⚙️ 新手引导设置</h2>

      <section className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={preferences.showTips}
            onChange={(e) => toggleTips(e.target.checked)}
          />
          <span>显示新手提示</span>
        </label>
      </section>

      <section className="setting-group">
        <label>提示详细程度：</label>
        <select
          value={preferences.tipLevel}
          onChange={(e) => setTipLevel(e.target.value as any)}
          disabled={!preferences.showTips}
        >
          <option value="all">显示所有提示</option>
          <option value="important_only">仅显示重要提示</option>
          <option value="none">不显示提示</option>
        </select>
      </section>

      <section className="setting-group">
        <button
          onClick={() => {
            if (window.confirm('这将重置所有引导进度，确定吗？')) {
              resetOnboarding();
              window.location.reload();
            }
          }}
          className="btn-danger"
        >
          重置新手引导
        </button>
        <small>这将允许你重新看到所有新手提示</small>
      </section>

      <section className="setting-group">
        <a href="/help" className="btn-primary">
          查看完整帮助文档
        </a>
      </section>
    </div>
  );
};
```

---

## 🎭 自定义提示样式

### 示例：修改提示颜色

编辑 `src/components/onboarding/OnboardingTip.css`:

```css
/* 修改提示背景色 */
.onboarding-tip-primary {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

/* 修改边框色 */
.onboarding-tip-secondary {
  border: 2px solid #your-color;
}

/* 修改按钮样式 */
.onboarding-tip-primary .btn-primary {
  background: #your-button-color;
}
```

---

## 📊 分析和报告

### 跟踪引导完成率

```tsx
import { useOnboarding } from './stores/onboardingStore';

export const AnalyticsDashboard: React.FC = () => {
  const { progress, completedTutorials } = useOnboarding();

  const completionRate = (completedTutorials.length / 5) * 100;

  return (
    <div className="analytics">
      <h3>引导完成率</h3>
      <progress value={completionRate} max="100" />
      <p>{completionRate.toFixed(0)}% 完成</p>

      <h4>已完成的步骤：</h4>
      <ul>
        {progress.completedSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>

      <h4>已跳过的提示：</h4>
      <p>{progress.skipedTips.length} 个提示被关闭</p>
    </div>
  );
};
```

---

## 🧩 高级：自定义提示内容

### 动态提示

```tsx
import { useOnboarding } from '../stores/onboardingStore';
import { OnboardingTipManager } from '../components/onboarding';

export const DynamicTip: React.FC = () => {
  const { progress } = useOnboarding();

  // 根据用户进度显示不同的提示
  const getTipForProgress = () => {
    if (progress.completedSteps.includes('first_battle_complete')) {
      return 'next_tutorial_tip';
    }
    return 'battle_intro';
  };

  return (
    <OnboardingTipManager triggerId={getTipForProgress()} />
  );
};
```

### 条件提示

```tsx
export const ConditionalTip: React.FC = () => {
  const { progress, preferences } = useOnboarding();

  // 只有当用户启用了提示，且还没有跳过这个提示时才显示
  if (
    !preferences.showTips ||
    progress.skipedTips.includes('my_tip_id')
  ) {
    return null;
  }

  return <OnboardingTipManager triggerId="my_tip_id" />;
};
```

---

## 🔍 调试技巧

### 在浏览器控制台检查状态

```javascript
// 在浏览器开发者工具中运行
const store = require('./stores/onboardingStore').useOnboarding.getState();
console.log('引导进度:', store.progress);
console.log('可见提示:', store.visibleTips);
console.log('用户偏好:', store.preferences);
```

### 强制显示提示

```javascript
// 显示所有提示（用于测试）
const { useOnboarding } = require('./stores/onboardingStore');
const store = useOnboarding.getState();
Object.keys(require('./data/helpContent').TIPS_CONFIG).forEach(key => {
  store.showTip(require('./data/helpContent').TIPS_CONFIG[key].id);
});
```

---

## 📝 常见集成模式

### 模式 1: 首次用户流程

```tsx
if (!progress.completedStory) {
  return <WelcomeStory />;
}

if (!progress.firstTimeViews.menu) {
  return <MenuTutorial />;
}

return <MainGame />;
```

### 模式 2: 渐进式功能解锁

```tsx
const canAccessFeature = progress.completedSteps.includes('prerequisite_step');

return canAccessFeature ? <Feature /> : <LockedFeature />;
```

### 模式 3: 成就和里程碑

```tsx
const achievements = {
  first_hero: progress.completedSteps.includes('first_hero_created'),
  first_battle: progress.completedSteps.includes('first_battle_complete'),
  first_tea: progress.completedSteps.includes('first_tea_made'),
};

return <AchievementsDisplay achievements={achievements} />;
```

---

这些示例应该能帮助你快速在游戏中集成三层新手引导系统！
