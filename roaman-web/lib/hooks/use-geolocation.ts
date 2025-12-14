"use client"

import { useState, useEffect, useCallback } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
  permissionDenied: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
    permissionDenied: false,
  })

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by your browser",
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
          permissionDenied: false,
        })
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
          permissionDenied: error.code === error.PERMISSION_DENIED,
        }))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      },
    )
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return { ...state, requestLocation }
}
