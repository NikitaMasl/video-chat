import { cnb } from 'cnbuilder';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import MutedCam from 'shared/icons/MutedCam';
import MutedMic from 'shared/icons/MutedMic';
import { emptyFunc } from 'shared/lib/utils/emptyFunc';

import styles from './Video.module.scss';

interface IProps {
    src?: string;
    volume?: number;
    stream?: MediaStream | null;
    muted?: boolean;
    showPlug?: boolean;
    className?: string;
    isMicMuted?: boolean;
    onPlayError?: (videoEl: HTMLMediaElement, e: Error) => void;
}

const Video = forwardRef<HTMLMediaElement, IProps>((props, ref) => {
    const {
        src,
        stream,
        isMicMuted = false,
        showPlug = false,
        className = '',
        muted = false,
        volume,
        onPlayError = emptyFunc,
    } = props;

    const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
    const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

    const videoRef = useRef<HTMLMediaElement>(null);

    const handleRef = (r: HTMLMediaElement | null) => {
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
                    onPlayError(videoRef.current as HTMLMediaElement, e);
                }
            });
            videoRef.current.onchange = (e) => {
                console.log({ e });
            };
        }
    }, [stream, onPlayError]);

    useEffect(() => {
        if (stream) {
            stream.onremovetrack = (e) => {
                console.log({ e });
            };
            stream.onaddtrack = (e) => {
                console.log({ e });
            };

            stream.getAudioTracks().forEach((audioTrack) => {
                audioTrack.onended = () => {
                    setIsAudioMuted(true);
                };
                audioTrack.onmute = () => {
                    setIsVideoMuted(true);
                };
                audioTrack.onunmute = () => {
                    setIsVideoMuted(false);
                };
            });

            stream.getVideoTracks().forEach((videoTrack) => {
                setIsVideoMuted(videoTrack.muted);

                videoTrack.onmute = () => {
                    if (videoRef.current) {
                        setIsVideoMuted(true);
                    }
                };
                videoTrack.onunmute = () => {
                    if (videoRef.current) {
                        setIsVideoMuted(false);
                        videoRef.current.play().catch((e) => {
                            if (e.name !== 'AbortError') {
                                console.log('Error; Video.play;', e);
                                onPlayError(videoRef.current as HTMLMediaElement, e);
                            }
                        });
                    }
                };
            });
        }
    }, [stream, onPlayError]);

    useEffect(() => {
        if (videoRef.current && (volume || volume === 0)) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <>
            <video
                autoPlay
                playsInline
                style={{ pointerEvents: 'none' }}
                ref={handleRef}
                className={cnb(className, styles.videoPreview)}
                muted={muted}
                src={src}
            />
            {Boolean(isVideoMuted || showPlug || !stream) && (
                <div
                    className={cnb(className, styles.frozenPlug, {
                        [styles.showPlug]: showPlug,
                    })}
                >
                    <MutedCam className={styles.mutedCanIcon} />
                </div>
            )}
            {(isAudioMuted || isMicMuted) && (
                <div className={styles.mutedMicWrapper}>
                    <MutedMic className={styles.mutedMic} />
                </div>
            )}
        </>
    );
});

Video.displayName = 'Video';

export default React.memo(Video);
