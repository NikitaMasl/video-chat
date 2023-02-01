export enum TextVariants {
    EMPTY = '',
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    SPAN = 'span',
    PARAGRAPH = 'p',
    ANCHOR = 'a',
}
export const TEXT_VARIANTS_ARRAY = Object.values(TextVariants);

export enum TextSizes {
    EMPTY = '',
    S1 = 's1',
    S2 = 's2',
    S3 = 's3',
    S4 = 's4',
    S5 = 's5',
    S6 = 's6',
}
export const TEXT_SIZES_ARRAY = Object.values(TextSizes);

export enum TextWeights {
    EMPTY = '',
    THIN = 'w300',
    MEDIUM = 'w400',
    BOLD = 'w600',
}
export const TEXT_WEIGHTS_ARRAY = Object.values(TextWeights);

export enum TextColors {
    EMPTY = '',
    DARK_BLUE = 'cdb',
    DEFAULT = 'cd',
    SECONDARY = 'cs',
    DANGER = 'cdanger',
    WHITE = 'wh',
}
export const TEXT_COLORS_ARRAY = Object.values(TextColors);

export enum TextDisplays {
    EMPTY = '',
    INLINE = 'di',
    INLINE_BLOCK = 'dib',
    BLOCK = 'db',
}
export const TEXT_DISPLAYS_ARRAY = Object.values(TextDisplays);

export enum TextAlignments {
    EMPTY = '',
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
    JUSTIFY = 'justify',
}
export const TEXT_ALIGNMENTS_ARRAY = Object.values(TextAlignments);
