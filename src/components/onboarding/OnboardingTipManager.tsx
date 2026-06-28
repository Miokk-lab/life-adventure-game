import React, { useEffect } from 'react';
import { useOnboarding } from '../../stores/onboardingStore';
import { getTipsConfig } from '../../data/helpContent';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { OnboardingTipPrimary } from './OnboardingTipPrimary';
import { OnboardingTipSecondary } from './OnboardingTipSecondary';
import { OnboardingTipTertiary } from './OnboardingTipTertiary';
import type { OnboardingTip } from '../../types/onboarding';

interface OnboardingTipManagerProps {
  triggerId?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onTipDismissed?: (tipId: string) => void;
}

export const OnboardingTipManager: React.FC<OnboardingTipManagerProps> = ({
  triggerId,
  position = 'bottom',
  onTipDismissed,
}) => {
  const { progress, preferences, visibleTips, showTip, dismissTip } = useOnboarding();
  const language = useLanguageStore((s) => s.language);
  const tipsConfig = getTipsConfig(language);

  // 自动显示相关的提示
  useEffect(() => {
    if (!triggerId || !preferences.showTips) return;

    const tipConfig = Object.values(tipsConfig).find(
      (tip) => tip.id === triggerId
    );

    if (
      tipConfig &&
      tipConfig.trigger === 'auto' &&
      !progress.skipedTips.includes(tipConfig.id) &&
      (preferences.tipLevel === 'all' ||
        (preferences.tipLevel === 'important_only' && tipConfig.level !== 'tertiary'))
    ) {
      showTip(tipConfig.id);
    }
  }, [triggerId, preferences, progress.skipedTips, showTip, tipsConfig]);

  // 渲染可见的提示
  const renderTip = (tipId: string) => {
    const tipConfig = Object.values(tipsConfig).find((tip) => tip.id === tipId);
    if (!tipConfig) return null;

    const tip = tipConfig as OnboardingTip;

    const handleClose = () => {
      dismissTip(tipId);
      onTipDismissed?.(tipId);
    };

    switch (tip.level) {
      case 'primary':
        return (
          <OnboardingTipPrimary
            key={tipId}
            tip={tip}
            onClose={handleClose}
          />
        );
      case 'secondary':
        return (
          <OnboardingTipSecondary
            key={tipId}
            tip={tip}
            position={position}
            onClose={handleClose}
          />
        );
      case 'tertiary':
        return (
          <OnboardingTipTertiary
            key={tipId}
            tip={tip}
          />
        );
      default:
        return null;
    }
  };

  // 只显示主要的或二级的提示（三级通过组件本身显示）
  const visibleMainTips = visibleTips.filter((tipId) => {
    const tipConfig = Object.values(tipsConfig).find((tip) => tip.id === tipId);
    return tipConfig && (tipConfig.level === 'primary' || tipConfig.level === 'secondary');
  });

  if (visibleMainTips.length === 0) return null;

  return <>{visibleMainTips.map(renderTip)}</>;
};

// 便利的Hook用于获取三级提示
export const useHelpTip = (tipId: string) => {
  const { progress, preferences, visibleTips, dismissTip } = useOnboarding();
  const language = useLanguageStore((s) => s.language);
  const tipsConfig = getTipsConfig(language);
  const tipConfig = Object.values(tipsConfig).find((tip) => tip.id === tipId);

  const shouldShow =
    preferences.showTips &&
    !progress.skipedTips.includes(tipId) &&
    (preferences.tipLevel === 'all' ||
      (preferences.tipLevel === 'important_only' && tipConfig?.level !== 'tertiary'));

  return {
    tip: tipConfig as OnboardingTip | undefined,
    shouldShow,
    isDismissed: progress.skipedTips.includes(tipId),
    isVisible: visibleTips.includes(tipId),
    dismissTip: () => dismissTip(tipId),
  };
};
