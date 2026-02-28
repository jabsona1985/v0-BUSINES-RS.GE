'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Camera, Keyboard } from 'lucide-react'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onClose: () => void
  title?: string
}

export function BarcodeScanner({ onScan, onClose, title = 'ბარკოდის სკანირება' }: BarcodeScannerProps) {
  const [manualInput, setManualInput] = useState('')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const readerRef = useRef<any>(null)

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 1200
      gain.gain.value = 0.3
      osc.start()
      setTimeout(() => {
        osc.stop()
        ctx.close()
      }, 80)
    } catch (e) {
      // Audio not supported
    }
  }, [])

  const cleanup = useCallback(() => {
    if (readerRef.current) {
      try {
        readerRef.current.reset()
      } catch (e) {
        // Ignore reset errors
      }
      readerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }, [])

  const handleScan = useCallback((barcode: string) => {
    playBeep()
    cleanup()
    onScan(barcode)
  }, [playBeep, cleanup, onScan])

  const handleClose = useCallback(() => {
    cleanup()
    onClose()
  }, [cleanup, onClose])

  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      handleScan(manualInput.trim())
    }
  }, [manualInput, handleScan])

  useEffect(() => {
    let mounted = true

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
        })

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop())
          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setIsScanning(true)

          // Dynamic import for @zxing/library
          const { BrowserMultiFormatReader } = await import('@zxing/library')
          const reader = new BrowserMultiFormatReader()
          readerRef.current = reader

          reader.decodeFromVideoElement(videoRef.current, (result) => {
            if (result && mounted) {
              handleScan(result.getText())
            }
          })
        }
      } catch (error: any) {
        if (mounted) {
          if (error.name === 'NotAllowedError') {
            setCameraError('კამერაზე წვდომა უარყოფილია')
          } else if (error.name === 'NotFoundError') {
            setCameraError('კამერა ვერ მოიძებნა')
          } else {
            setCameraError('კამერაზე წვდომა შეუძლებელია')
          }
        }
      }
    }

    startCamera()

    return () => {
      mounted = false
      cleanup()
    }
  }, [cleanup, handleScan])

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  return (
    <div className="scanner-overlay">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
      >
        <X className="w-6 h-6" />
      </button>

      {/* Title */}
      <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>

      {/* Camera frame */}
      <div className="scanner-frame">
        {cameraError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4" style={{ background: '#1f2937' }}>
            <Camera className="w-10 h-10 text-gray-500 mb-2" />
            <p className="text-gray-400 text-sm text-center">{cameraError}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {isScanning && <div className="scanner-line" />}
          </>
        )}
      </div>

      {/* Manual input */}
      <div className="w-[300px] mt-4">
        <p className="text-gray-400 text-sm mb-2 text-center">{'ან შეიყვანეთ ხელით:'}</p>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="ბარკოდი..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
              autoFocus={!!cameraError}
            />
          </div>
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            style={{ background: '#22c55e', color: 'white' }}
          >
            {'->'}
          </button>
        </form>
      </div>

      {/* Cancel button */}
      <button
        onClick={handleClose}
        className="mt-6 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        {'გაუქმება'}
      </button>
    </div>
  )
}
