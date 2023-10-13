export function getOperatingSystemByUserAgent(userAgent) {
  if (/android/i.test(userAgent)) {
    return 'Android'
  }

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'iOS'
  }

  return 'PC'
}
