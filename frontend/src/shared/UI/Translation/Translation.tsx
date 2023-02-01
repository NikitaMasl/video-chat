import React from 'react';
import { useTranslation } from '../../lib/hooks/useTranslation';

interface IProps {
    ns: string;
    t: string;
    options?: Record<string, unknown>;
}

const Translation = (props: IProps) => {
    const { ns, t: ts, options = {} } = props;
    const { t } = useTranslation(ns);

    return <>{t(ts, options)}</>;
};

export default React.memo(Translation);
