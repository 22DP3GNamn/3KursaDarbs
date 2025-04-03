export function enableDarkMode() {
    document.documentElement.classList.add('dark-mode')
  }
  
  export function disableDarkMode() {
    document.documentElement.classList.remove('dark-mode')
  }
  
  export function toggleDarkMode(isDarkMode) {
    if (isDarkMode) {
      enableDarkMode()
    } else {
      disableDarkMode()
    }
  }