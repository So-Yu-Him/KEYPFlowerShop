/**
 * Toast.jsx — floating notification bar at the bottom of the screen
 *
 * This component reads `toast` and `toastVisible` from WalletContext.
 * It's rendered once at the page level (inside each page's JSX).
 *
 * CSS classes:
 *   "toast"       → hidden (off-screen below)
 *   "toast show"  → visible (slides up via CSS transition)
 */
import { useWallet } from '../context/WalletContext'

function Toast() {
  const { toast, toastVisible } = useWallet()

  return (
    <div className={`toast${toastVisible ? ' show' : ''}`}>
      {toast}
    </div>
  )
}

export default Toast
