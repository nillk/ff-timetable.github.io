import Typography from 'typography'

const typography = new Typography({
    baseFontSize: '14px',
    baseLineHeight: 1.666,
    headerFontFamily: [
        'Helvetica',
        'Helvetica Neue',
    ],
    bodyFontFamily: ['Helvetica', 'Helvetica Neue']
})

export const { scale, rhythm, options } = typography
export default typography
