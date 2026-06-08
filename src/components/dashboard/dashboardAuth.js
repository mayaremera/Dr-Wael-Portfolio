export const DASHBOARD_PASSWORD = '1999'
export const DASHBOARD_PASSWORD_LENGTH = DASHBOARD_PASSWORD.length

export function verifyDashboardPassword(password) {
  return password === DASHBOARD_PASSWORD
}
