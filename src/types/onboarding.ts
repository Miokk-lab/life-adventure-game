/**
 * 新手引导系统 - 类型定义
 */

export type TipLevel = 'primary' | 'secondary' | 'tertiary';
export type OnboardingStep =
  | 'story_complete'
  | 'menu_seen'
  | 'tasks_tutorial'
  | 'battle_tutorial'
  | 'teahouse_tutorial'
  | 'first_quest_complete'
  | 'first_battle_complete'
  | 'first_tea_made';

export interface OnboardingTip {
  id: string;
  level: TipLevel;
  title: string;
  description: string;
  trigger: 'auto' | 'manual';
  targetElement?: string;
  dismissible: boolean;
  icon?: string;
  duration?: number;
}

export interface OnboardingProgress {
  userId: string;
  completedStory: boolean;
  completedSteps: OnboardingStep[];
  skipedTips: string[];
  firstTimeViews: {
    menu: boolean;
    tasks: boolean;
    battle: boolean;
    teaHouse: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface HelpArticle {
  id: string;
  title: string;
  category: 'getting_started' | 'gameplay' | 'systems' | 'faq';
  content: string;
  relatedTopics?: string[];
  estimatedReadTime: number;
}

export interface MenuItemHelp {
  id: string;
  label: string;
  icon: string;
  description: string;
  helpText: string;
  children?: MenuItemHelp[];
}

export interface OnboardingState {
  progress: OnboardingProgress;
  visibleTips: string[];
  completedTutorials: string[];
  preferences: OnboardingPreferences;
}

export interface OnboardingPreferences {
  showTips: boolean;
  tipLevel: 'all' | 'important_only' | 'none';
}
