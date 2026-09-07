"use client"

import * as React from "react"

/**
 * Acompanha uma media query do CSS a partir do React.
 *
 * Devolve `false` na primeira renderizacao do servidor, onde `window` nao
 * existe, e sincroniza com o valor real assim que o componente monta.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    [query],
  )

  const getSnapshot = React.useCallback(
    () => window.matchMedia(query).matches,
    [query],
  )

  const getServerSnapshot = React.useCallback(() => false, [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
