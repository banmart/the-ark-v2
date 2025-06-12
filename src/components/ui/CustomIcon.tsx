
import React from 'react';

interface CustomIconProps {
  name: string;
  size?: number;
  className?: string;
}

const CustomIcon = ({ name, size = 24, className = "" }: CustomIconProps) => {
  const iconProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    className: `${className} transition-all duration-300`
  };

  const renderIcon = () => {
    switch (name) {
      case 'flood':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="flood-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path d="M3 12c0-1.5 1-3 3-3s3 1.5 3 3-1 3-3 3-3-1.5-3-3z" fill="url(#flood-gradient)" opacity="0.7" />
            <path d="M9 12c0-1.5 1-3 3-3s3 1.5 3 3-1 3-3 3-3-1.5-3-3z" fill="url(#flood-gradient)" opacity="0.8" />
            <path d="M15 12c0-1.5 1-3 3-3s3 1.5 3 3-1 3-3 3-3-1.5-3-3z" fill="url(#flood-gradient)" opacity="0.9" />
            <path d="M2 16c0-1 0.5-2 2-2s2 1 2 2-0.5 2-2 2-2-1-2-2z" fill="url(#flood-gradient)" opacity="0.6" />
            <path d="M8 16c0-1 0.5-2 2-2s2 1 2 2-0.5 2-2 2-2-1-2-2z" fill="url(#flood-gradient)" opacity="0.7" />
            <path d="M14 16c0-1 0.5-2 2-2s2 1 2 2-0.5 2-2 2-2-1-2-2z" fill="url(#flood-gradient)" opacity="0.8" />
            <path d="M18 16c0-1 0.5-2 2-2s2 1 2 2-0.5 2-2 2-2-1-2-2z" fill="url(#flood-gradient)" opacity="0.9" />
          </svg>
        );

      case 'lightning':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#lightning-gradient)" />
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#06b6d4" strokeWidth="0.5" fill="none" opacity="0.8" />
          </svg>
        );

      case 'dove':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="dove-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path d="M12 2c-4 0-8 2-8 6 0 2 2 4 4 4h8c2 0 4-2 4-4 0-4-4-6-8-6z" fill="url(#dove-gradient)" opacity="0.8" />
            <path d="M16 8c2-1 4-1 6 1" stroke="url(#dove-gradient)" strokeWidth="2" fill="none" />
            <path d="M8 12l-4 4" stroke="url(#dove-gradient)" strokeWidth="2" fill="none" />
            <circle cx="10" cy="8" r="1" fill="#ffffff" />
          </svg>
        );

      case 'shield':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z" fill="url(#shield-gradient)" opacity="0.8" />
            <path d="M9 12l2 2 4-4" stroke="#ffffff" strokeWidth="2" fill="none" />
            <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
        );

      case 'users':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="users-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <circle cx="8" cy="7" r="3" fill="url(#users-gradient)" opacity="0.8" />
            <circle cx="16" cy="7" r="3" fill="url(#users-gradient)" opacity="0.6" />
            <path d="M8 14s-2 0-2 2v4h8v-4c0-2-2-2-2-2" fill="url(#users-gradient)" opacity="0.8" />
            <path d="M16 14s-1 0-1 1v3h4v-3c0-1-1-1-1-1" fill="url(#users-gradient)" opacity="0.6" />
          </svg>
        );

      case 'gift':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="gift-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <rect x="4" y="9" width="16" height="11" rx="2" fill="url(#gift-gradient)" opacity="0.8" />
            <path d="M8 5a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z" fill="url(#gift-gradient)" opacity="0.6" />
            <path d="M16 5a3 3 0 0 1 3 3h-6a3 3 0 0 1 3-3z" fill="url(#gift-gradient)" opacity="0.6" />
            <line x1="12" y1="9" x2="12" y2="20" stroke="#ffffff" strokeWidth="2" />
            <line x1="4" y1="9" x2="20" y2="9" stroke="#ffffff" strokeWidth="1" />
          </svg>
        );

      case 'lock':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="lock-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <rect x="5" y="11" width="14" height="9" rx="2" fill="url(#lock-gradient)" opacity="0.8" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="url(#lock-gradient)" strokeWidth="2" fill="none" />
            <circle cx="12" cy="16" r="2" fill="#ffffff" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.6" />
          </svg>
        );

      case 'ship':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="ship-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cd7f32" />
                <stop offset="100%" stopColor="#8b4513" />
              </linearGradient>
            </defs>
            <path d="M4 18h16l-2-8H6l-2 8z" fill="url(#ship-gradient)" opacity="0.8" />
            <path d="M12 2v8" stroke="url(#ship-gradient)" strokeWidth="2" />
            <path d="M12 2l-4 4h8l-4-4z" fill="url(#ship-gradient)" opacity="0.6" />
            <path d="M4 18c0 2 2 4 8 4s8-2 8-4" stroke="url(#ship-gradient)" strokeWidth="1" fill="none" />
          </svg>
        );

      case 'crown':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="crown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#ffb000" />
              </linearGradient>
            </defs>
            <path d="M4 16l2-8 3 4 3-6 3 6 3-4 2 8H4z" fill="url(#crown-gradient)" opacity="0.8" />
            <circle cx="6" cy="8" r="1" fill="url(#crown-gradient)" />
            <circle cx="12" cy="2" r="1" fill="url(#crown-gradient)" />
            <circle cx="18" cy="8" r="1" fill="url(#crown-gradient)" />
            <path d="M4 16h16" stroke="#ffd700" strokeWidth="2" />
          </svg>
        );

      case 'diamond':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="diamond-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b9f2ff" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
            <path d="M6 3h12l2 6-8 12L4 9l2-6z" fill="url(#diamond-gradient)" opacity="0.8" />
            <path d="M6 9h12" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <path d="M9 3l3 6 3-6" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            <path d="M6 3h12l2 6-8 12L4 9l2-6z" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.4" />
          </svg>
        );

      case 'star':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e5e4e2" />
                <stop offset="50%" stopColor="#c0c0c0" />
                <stop offset="100%" stopColor="#a8a8a8" />
              </linearGradient>
            </defs>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#star-gradient)" opacity="0.8" />
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#e5e4e2" strokeWidth="1" fill="none" opacity="0.4" />
          </svg>
        );

      case 'fire':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="fire-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            <path d="M12 2C8 6 6 10 6 14c0 4 2 6 6 6s6-2 6-6c0-4-2-8-6-12z" fill="url(#fire-gradient)" opacity="0.8" />
            <path d="M12 6c-2 2-3 4-3 6 0 2 1 3 3 3s3-1 3-3c0-2-1-4-3-6z" fill="#ffffff" opacity="0.3" />
            <path d="M12 2C8 6 6 10 6 14c0 4 2 6 6 6s6-2 6-6c0-4-2-8-6-12z" stroke="#ff6b35" strokeWidth="1" fill="none" opacity="0.4" />
          </svg>
        );

      case 'money':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="money-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <rect x="2" y="7" width="20" height="10" rx="2" fill="url(#money-gradient)" opacity="0.8" />
            <circle cx="12" cy="12" r="3" stroke="#ffffff" strokeWidth="2" fill="none" />
            <path d="M12 10v1m0 2v1m-1-2h2" stroke="#ffffff" strokeWidth="1" />
            <path d="M6 10h2m8 0h2" stroke="#ffffff" strokeWidth="1" />
          </svg>
        );

      case 'vault':
        return (
          <svg {...iconProps}>
            <defs>
              <linearGradient id="vault-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <rect x="3" y="6" width="18" height="14" rx="2" fill="url(#vault-gradient)" opacity="0.8" />
            <circle cx="15" cy="13" r="3" stroke="#ffffff" strokeWidth="2" fill="none" />
            <path d="M15 11v4m-2-2h4" stroke="#ffffff" strokeWidth="1" />
            <rect x="3" y="4" width="18" height="2" fill="url(#vault-gradient)" opacity="0.6" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))' }}>
      {renderIcon()}
    </div>
  );
};

export default CustomIcon;
