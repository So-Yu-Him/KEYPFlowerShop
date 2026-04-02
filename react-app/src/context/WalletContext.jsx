// filepath: src/context/WalletContext.jsx
/**
 * WalletContext — shared wallet state across all pages
 *
 * New in this version:
 *   - localStorage persistence: on page refresh, cached address is restored
 *     and displayed, but the user is NOT asked to re-sign (display-only recovery)
 *   - isCachedRestore flag: true when address came from localStorage (not live session)
 *   - hasMetaMask: exposed for the "Install MetaMask" button in Navbar
 */

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { ethers } from 'ethers'

const WalletContext = createContext(null)

const LS_KEY = 'florex_wallet_address'   // localStorage key

export function WalletProvider({ children }) {
  const [address,          setAddress]          = useState(null)
  const [networkName,      setNetworkName]       = useState(null)
  const [isConnected,      setIsConnected]       = useState(false)
  const [isCachedRestore,  setIsCachedRestore]   = useState(false) // restored from cache, no live session

  const [toast,        setToast]        = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimerRef = useRef(null)

  // ── Restore from localStorage on first load ──────────────────
  useEffect(() => {
    const cached = localStorage.getItem(LS_KEY)
    if (cached) {
      setAddress(cached)
      setIsConnected(true)   // show as connected visually
      setIsCachedRestore(true)
    }
  }, [])

  // ── Toast ─────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg)
    setToastVisible(true)
    clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3500)
  }, [])

  const truncateAddress = (addr) => {
    if (!addr) return ''
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  }

  // ── Connect MetaMask ──────────────────────────────────────────
  const connect = useCallback(async (appName = 'FloreX') => {
    if (isConnected && !isCachedRestore) {
      showToast('Already connected: ' + truncateAddress(address))
      return
    }

    if (typeof window.ethereum === 'undefined') {
      showToast('⚠️ MetaMask not detected. Click "Install MetaMask" to install.')
      return
    }

    try {
      showToast('🔄 Connecting to MetaMask...')

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer  = provider.getSigner()
      const addr    = await signer.getAddress()
      const network = await provider.getNetwork()

      // Ask user to sign — proves wallet ownership
      const msg = `Sign in to ${appName}\nWallet: ${addr}\nTimestamp: ${new Date().toISOString()}`
      await signer.signMessage(msg)

      // Update state
      setAddress(addr)
      setIsConnected(true)
      setIsCachedRestore(false)
      setNetworkName(
        network.name === 'unknown' ? `Chain ${network.chainId}` : network.name
      )

      // Persist to localStorage so refresh doesn't require re-login
      localStorage.setItem(LS_KEY, addr)
      showToast('✅ Wallet connected!')

      // Listen for account / network changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsCachedRestore(false)
          localStorage.setItem(LS_KEY, accounts[0])
          showToast('Account switched: ' + truncateAddress(accounts[0]))
        } else {
          handleDisconnect()
        }
      })

      window.ethereum.on('chainChanged', () => window.location.reload())

    } catch (err) {
      if (err.code === 4001) {
        showToast('❌ Connection cancelled')
      } else {
        showToast('❌ ' + (err.message || 'Unknown error').slice(0, 60))
      }
    }
  }, [isConnected, isCachedRestore, address, showToast])

  // ── Disconnect ────────────────────────────────────────────────
  const handleDisconnect = useCallback(() => {
    setAddress(null)
    setIsConnected(false)
    setIsCachedRestore(false)
    setNetworkName(null)
    localStorage.removeItem(LS_KEY)
    showToast('👋 Wallet disconnected')
  }, [showToast])

  const value = {
    address,
    networkName,
    isConnected,
    isCachedRestore,
    truncateAddress,
    connect,
    disconnect: handleDisconnect,
    toast,
    toastVisible,
    showToast,
    hasMetaMask: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined',
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>')
  return ctx
}
