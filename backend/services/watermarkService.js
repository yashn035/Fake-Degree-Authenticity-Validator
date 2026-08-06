import sharp from 'sharp';

export const embedWatermark = async (imageBuffer) => {
    try {
        const svgWatermark = `
            <svg width="800" height="800">
                <style>
                .title { fill: rgba(0, 255, 0, 0.3); font-size: 80px; font-weight: bold; transform: rotate(-45deg); transform-origin: 50% 50%; }
                </style>
                <text x="50%" y="50%" text-anchor="middle" class="title">VERIFIED AUTHENTIC</text>
            </svg>
        `;

        const watermarkedBuffer = await sharp(imageBuffer)
            .composite([
                {
                    input: Buffer.from(svgWatermark),
                    gravity: 'center',
                },
            ])
            .toBuffer();

        return watermarkedBuffer;
    } catch (err) {
        console.error('Watermark Error:', err);
        return imageBuffer;
    }
};
