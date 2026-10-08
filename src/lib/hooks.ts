"use client";
import { useEffect, useState } from "react";

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: boolean }>({ data: null, loading: true, error: false });
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: false }));
    fn().then((data) => live && setState({ data, loading: false, error: false }))
        .catch(() => live && setState({ data: null, loading: false, error: true }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}
