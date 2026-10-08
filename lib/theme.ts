'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { DEFAULT_THEME_PREFERENCE, THEME_STORAGE_KEY } from '@/lib/theme-script'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const THEME_EVENT = 'af-theme-change'
const THEME_COLORS: Record<ResolvedTheme, string> = { light: '#f1f4f9', dark: '#0f1117' }

function isPreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function getStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return DEFAULT_THEME_PREFERENCE
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isPreference(stored) ? stored : DEFAULT_THEME_PREFERENCE
  } catch {
    return DEFAULT_THEME_PREFERENCE
  }
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== 'system') return preference
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Applies a resolved theme to <html>; optionally animates the colour change. */
export function applyTheme(theme: ResolvedTheme, animate = false) {
  const root = document.documentElement
  if (animate) {
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), 400)
  }
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLORS[theme])
}

export function setThemePreference(preference: ThemePreference) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    /* storage unavailable (private mode) – theme still applies for this session */
  }
  applyTheme(resolveTheme(preference), true)
  window.dispatchEvent(new Event(THEME_EVENT))
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemChange = () => {
    // Only re-apply when the user follows the system theme
    if (getStoredPreference() === 'system') applyTheme(resolveTheme('system'), true)
    onChange()
  }
  window.addEventListener(THEME_EVENT, onChange)
  window.addEventListener('storage', handleSystemChange)
  media.addEventListener('change', handleSystemChange)
  return () => {
    window.removeEventListener(THEME_EVENT, onChange)
    window.removeEventListener('storage', handleSystemChange)
    media.removeEventListener('change', handleSystemChange)
  }
}

const getServerPreference = (): ThemePreference => DEFAULT_THEME_PREFERENCE

/** Preference snapshot is a string, so useSyncExternalStore compares by value. */
function useStoredPreference(): ThemePreference {
  return useSyncExternalStore(subscribe, getStoredPreference, getServerPreference)
}

function getResolvedSnapshot(): ResolvedTheme {
  return resolveTheme(getStoredPreference())
}

const getServerResolved = (): ResolvedTheme => 'dark'

export function useTheme() {
  const preference = useStoredPreference()
  const resolvedTheme = useSyncExternalStore(subscribe, getResolvedSnapshot, getServerResolved)

  const setTheme = useCallback((next: ThemePreference) => setThemePreference(next), [])
  const toggleTheme = useCallback(() => {
    setThemePreference(resolveTheme(getStoredPreference()) === 'dark' ? 'light' : 'dark')
  }, [])

  return { preference, resolvedTheme, setTheme, toggleTheme }
}
