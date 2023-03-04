import React from 'react';
import MutedCam from './MutedCam';
import { IconProps } from './types';

const CamIcon = (props: IconProps & { muted?: boolean }) => {
    const { className, muted } = props;

    if (muted) {
        return <MutedCam className={className} />;
    }
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 9C2 6.79086 3.79086 5 6 5H13C15.2091 5 17 6.79086 17 9V9.07171L20.202 7.23108C21.0019 6.77121 22 7.34868 22 8.27144V15.7488C22 16.6203 21.1003 17.2012 20.306 16.8424L16.9855 15.3425C16.8118 17.3913 15.0938 19 13 19H6C3.79086 19 2 17.2091 2 15V9ZM17 13.1544L20 14.5096V9.65407L17 11.3786V13.1544ZM15 9C15 7.89543 14.1046 7 13 7H6C4.89543 7 4 7.89543 4 9V15C4 16.1046 4.89543 17 6 17H13C14.1046 17 15 16.1046 15 15V9Z"
                fill="currentColor"
            />
        </svg>
    );
};

export default React.memo(CamIcon);
