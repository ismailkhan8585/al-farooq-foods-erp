'use client'

import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type ThemePreference } from '@/lib/theme'

/** Compact animated sun/moon button for the top bar. */
export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      id="theme-toggle"
      className="icon-button theme-toggle"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      aria-pressed={isDark}
    >
      <Sun className="theme-toggle-sun" />
      <Moon className="theme-toggle-moon" />
    </button>
  )
}

const OPTIONS: { value: ThemePreference; label: string; hint: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', hint: 'Bright, clean workspace for daylight use', icon: Sun },
  { value: 'dark', label: 'Dark', hint: 'Low-glare interface for evenings & low light', icon: Moon },
  { value: 'system', label: 'System', hint: 'Automatically match this device setting', icon: Monitor },
]

/** Three-way theme picker with live mini previews. */
export function ThemeSelector() {
  const { preference, setTheme } = useTheme()

  return (
    <div className="theme-options" role="radiogroup" aria-label="Color theme">
      {OPTIONS.map(({ value, label, hint, icon: Icon }) => {
        const active = preference === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            id={`theme-option-${value}`}
            className={`theme-option ${active ? 'theme-option-active' : ''}`}
            onClick={() => setTheme(value)}
          >
            <span className={`theme-preview theme-preview-${value}`} aria-hidden="true">
              <span className="theme-preview-side" />
              <span className="theme-preview-body">
                <i />
                <i />
                <i />
              </span>
            </span>
            <span className="theme-option-meta">
              <span className="theme-option-title">
                <Icon className="w-3.5 h-3.5" /> {label}
                {active && <Check className="w-3.5 h-3.5 theme-option-check" />}
              </span>
              <span className="theme-option-hint">{hint}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
