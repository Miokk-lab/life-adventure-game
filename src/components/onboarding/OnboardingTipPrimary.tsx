import React from 'react';
import { useOnboarding } from '../../stores/onboardingStore';
import type { OnboardingTip } from '../../types/onboarding';
import { useTranslations } from '../../i18n';
import './OnboardingTip.css';

export interface OnboardingTipPrimaryProps {
  tip: OnboardingTip;
  onClose?: () => void;
}

export const OnboardingTipPrimary: React.FC<OnboardingTipPrimaryProps> = ({
  tip,
  onClose,
}) => {
  const { dismissTip } = useOnboarding();
  const tr = useTranslations();

  const handleDismiss = () => {
    dismissTip(tip.id);
    onClose?.();
  };

  return (
    <div className="onboarding-tip-overlay">
      <div className="onboarding-tip-primary">
        <div className="tip-header">
          {tip.icon && <span className="tip-icon">{tip.icon}</span>}
          <h2 className="tip-title">{tip.title}</h2>
        </div>

         <div className="tip-content">
          <p>{tip.description}</p>
        </div>

        <div className="tip-actions">
          <button
            className="btn-primary"
            onClick={handleDismiss}
          >
            {tr.tipActions.understandStart}
          </button>
          {tip.dismissible && (
            <button
              className="btn-secondary"
              onClick={handleDismiss}
            >
              {tr.tipActions.dontShowAgain}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
