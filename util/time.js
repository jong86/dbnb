export function now(multiple = 1, unit) {
  /* Returns time in seconds, with optional extra time */

  let extraTime = 0
  switch (unit) {
    case 'week':
    case 'weeks':
      extraTime = multiple * 604800
      break
    case 'day':
    case 'days':
      extraTime = multiple * 86400
      break
    case 'hour':
    case 'hours':
      extraTime = multiple * 3600
      break
    case 'minute':
    case 'minutes':
      extraTime = multiple * 60
      break
  }

  return (Date.now() / 1000) + extraTime
}