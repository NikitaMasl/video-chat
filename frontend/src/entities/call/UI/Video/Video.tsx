import React, { forwardRef, useEffect, useRef } from 'react';
import { emptyFunc } from 'shared/lib/utils/emptyFunc';

interface IProps {
    src?: string;
    volume?: number;
    stream?: MediaStream | null;
    muted?: boolean;
    className?: string;
    onPlayError?: (videoEl: HTMLVideoElement, e: Error) => void;
}

const Video = forwardRef<HTMLVideoElement, IProps>((props, ref) => {
    const { src, stream, className = '', muted = false, volume, onPlayError = emptyFunc } = props;

    const videoRef = useRef<HTMLVideoElement>(null);

    const handleRef = (r: HTMLVideoElement | null) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        videoRef.current = r;
        if (ref) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line no-param-reassign
            ref.current = r;
        }
    };

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch((e) => {
                if (e.name !== 'AbortError') {
                    console.log('Error; Video.play;', e);
                    onPlayError(videoRef.current as HTMLVideoElement, e);
                }
            });
        }
    }, [stream]);

    useEffect(() => {
        if (videoRef.current && (volume || volume === 0)) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
            autoPlay
            playsInline
            style={{ pointerEvents: 'none' }}
            ref={handleRef}
            className={className}
            muted={muted}
            src={src}
        />
    );
});

Video.displayName = 'Video';

export default React.memo(Video);
