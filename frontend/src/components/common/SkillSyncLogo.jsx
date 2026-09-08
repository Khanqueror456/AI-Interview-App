// src/components/SkillSyncLogo.jsx
import React from "react";

/**
 * SkillSync Logo – static, with icon and gradient wordmark.
 * @param {string} className - additional Tailwind classes
 * @param {boolean} showText - show wordmark (default true)
 * @param {string} textColor - text colour (fallback if gradient not used)
 * @param {string} iconColor - icon colour (default brand gold)
 * @param {number} size - icon size in px (default 32)
 */
export default function SkillSyncLogo({
  className = "",
  showText = true, // now true by default
  textColor = "text-[#14213D]",
  iconColor = "#E8A33D",
  size = 32,
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer circle */}
        <circle cx="16" cy="16" r="13" stroke={iconColor} strokeWidth="2.5" />
        {/* Top arrow */}
        <path
          d="M16 5L21 10L16 15"
          stroke={iconColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom arrow */}
        <path
          d="M16 27L11 22L16 17"
          stroke={iconColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Center dot */}
        <circle cx="16" cy="16" r="2.5" fill={iconColor} />
      </svg>

      {showText && (
        <span
          className={`text-2xl font-bold tracking-tight font-['Lora',_Georgia,_serif] ${textColor}`}
        >
          <span className="bg-gradient-to-r from-[#14213D] via-[#E8A33D] to-[#14213D] bg-[length:200%_auto] bg-clip-text text-transparent">
            SkillSync
          </span>
        </span>
      )}
    </div>
  );
}