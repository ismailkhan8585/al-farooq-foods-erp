// Server-safe theme constants (no 'use client') so the root layout can inline the bootstrap script.

export const THEME_STORAGE_KEY = 'af-theme'
export const DEFAULT_THEME_PREFERENCE: 'light' | 'dark' | 'system' = 'dark'

/**
 * Runs before first paint (injected in <head>) so the page never flashes the wrong theme.
 * Keep this in sync with `applyTheme` in lib/theme.ts.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var p=localStorage.getItem('${THEME_STORAGE_KEY}')||'${DEFAULT_THEME_PREFERENCE}';if(p!=='light'&&p!=='dark'&&p!=='system')p='${DEFAULT_THEME_PREFERENCE}';var t=p==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;var d=document.documentElement;d.setAttribute('data-theme',t);d.style.colorScheme=t;}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME_PREFERENCE}');}})();`
