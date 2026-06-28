import React, { useState } from 'react';
import { useOnboarding } from '../../stores/onboardingStore';
import type { OnboardingTip } from '../../types/onboarding';
import { useTranslations } from '../../i18n';
import './OnboardingTip.css';

export interface OnboardingTipTertiaryProps {
  tip: OnboardingTip;
  children?: React.ReactNode;
}

export const OnboardingTipTertiary: React.FC<OnboardingTipTertiaryProps> = ({
  tip,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { dismissTip } = useOnboarding();
  const tr = useTranslations();

  const handleDismiss = () => {
    dismissTip(tip.id);
  };

  return (
    <div className="onboarding-tip-tertiary">
      <button
        className="tip-trigger"
        onClick={() => setIsExpanded(!isExpanded)}
        title={tr.tipActions.clickToView}
      >
        <span className="help-icon">?</span>
      </button>

      {isExpanded && (
        <div className="tip-popover">
          <div className="tip-header">
            {tip.icon && <span className="tip-icon">{tip.icon}</span>}
            <h4 className="tip-title">{tip.title}</h4>
            {tip.dismissible && (
              <button
                className="btn-close"
                onClick={() => {
                  handleDismiss();
                  setIsExpanded(false);
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="tip-content">
            <p>{tip.description}</p>
            {children}
          </div>

          <div className="tip-actions">
            <button
              className="btn-secondary"
              onClick={() => setIsExpanded(false)}
            >
              {tr.tipActions.understood}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
