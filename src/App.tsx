import React, { useEffect, useRef } from 'react'
import { Subscription } from 'rxjs'
import './App.css'
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary'
import { RouterConfig } from './navigation/RouterConfig'
import { ToasterService } from './services/toaster-service/toaster-service'
import Toast from './components/ui/toast/Toast'

export const App: React.FC = () => {
  const toastVar: React.RefObject<any> = useRef(null)
  const isMountRef = useRef(false)

  useEffect(() => {
    isMountRef.current = true
    let subscription: Subscription

    if (isMountRef.current) {
      subscription = ToasterService.getMessage().subscribe((message) => {
        if (message && toastVar) {
          toastVar.current.show(message)
        }
      })
    }
    return () => {
      isMountRef.current = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <ErrorBoundary>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>

      <RouterConfig />
      <Toast toast={toastVar} baseZIndex={3000} />
    </ErrorBoundary>
  )
}
