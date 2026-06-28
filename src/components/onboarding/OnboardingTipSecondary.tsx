import React from 'react';
import { useOnboarding } from '../../stores/onboardingStore';
import type { OnboardingTip } from '../../types/onboarding';
import { useTranslations } from '../../i18n';
import './OnboardingTip.css';

export interface OnboardingTipSecondaryProps {
  tip: OnboardingTip;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClose?: () => void;
}

export const OnboardingTipSecondary: React.FC<OnboardingTipSecondaryProps> = ({
  tip,
  position = 'bottom',
  onClose,
}) => {
  const { dismissTip } = useOnboarding();
  const tr = useTranslations();

  const handleDismiss = () => {
    dismissTip(tip.id);
    onClose?.();
  };

  const positionClass = `position-${position}`;

  return (
    <div className={`onboarding-tip-secondary ${positionClass}`}>
      <div className="tip-header">
        {tip.icon && <span className="tip-icon">{tip.icon}</span>}
        <h3 className="tip-title">{tip.title}</h3>
      </div>

      <div className="tip-content">
        <p>{tip.description}</p>
      </div>

      <div className="tip-actions">
        {tip.dismissible && (
          <button
            className="btn-close"
            onClick={handleDismiss}
            title={tr.tipActions.closeTip}
          >
            ✕
          </button>
        )}
      </div>

      <div className="tip-arrow"></div>
    </div>
  );
};
