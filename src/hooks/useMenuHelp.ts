import { useOnboarding } from '../stores/onboardingStore';
import type { OnboardingTip } from '../types/onboarding';

interface MenuItemWithHelp {
  id: string;
  label: string;
  icon?: string;
  helpText?: string;
  helpTipId?: string;
}

export const useMenuHelp = (menuItem: MenuItemWithHelp) => {
  const { progress, preferences, showTip } = useOnboarding();

  const tipId = menuItem.helpTipId || `menu_${menuItem.id}`;
  const shouldShowHelpIcon =
    preferences.showTips &&
    !progress.skipedTips.includes(tipId) &&
    menuItem.helpText;

  const showHelp = () => {
    if (menuItem.helpTipId) {
      showTip(menuItem.helpTipId);
    }
  };

  return {
    shouldShowHelpIcon,
    showHelp,
    isSeen: progress.skipedTips.includes(tipId),
  };
};

// 获取菜单项的完整帮助信息
export const getMenuItemHelp = (itemId: string): Partial<MenuItemWithHelp> => {
  const helpTexts: Record<string, string> = {
    hero_panel: '查看英雄的详细信息，包括等级、属性、技能和装备。每完成任务，英雄都会获得经验。',
    daily_quests:
      '完成任务赚取金币和经验，帮助英雄升级。任务与你的生活息息相关。',
    battle_log:
      '查看英雄的战斗记录、统计和心魔图鉴。每场战斗都是对烦恼的一次理解之旅。',
    tea_house:
      '收集、制作和品饮花茶。花茶能帮助你调整心境，在战斗前制作合适的花茶还能获得战斗加成！',
    mood_journal: '记录你的日常想法和心理洞察，追踪你的成长轨迹。',
    dashboard: '用数据见证你的进步。看你的成就、情绪曲线和养成的习惯。',
  };

  return {
    id: itemId,
    helpText: helpTexts[itemId],
  };
};
