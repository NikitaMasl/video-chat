export const copyText = (text: string, element?: HTMLElement | null): void => {
    const area = document.createElement('textarea');
    area.value = text;
    if (element) {
        element.appendChild(area).select();
    } else {
        document.body.appendChild(area).select();
    }
    document.execCommand('copy');
    area.remove();
};
