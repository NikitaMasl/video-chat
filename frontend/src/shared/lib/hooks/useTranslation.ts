import { useCallback } from 'react';
import { useTranslation as useT } from 'next-i18next';

type ReturnT = {
    t: (ts: string, options?: Record<string, unknown>) => string;
};

export const useTranslation = (ns?: string): ReturnT => {
    const { t: tr } = useT(ns);

    const t = useCallback((ts: string, options = {}) => tr(ts, options), [tr]);

    return { t };
};
