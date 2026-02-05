const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const publicDir = path.join(__dirname, '../public')

async function generateIcon(size) {
  const svgImage = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)"/>
      <text x="50%" y="50%" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central" font-family="system-ui, -apple-system, sans-serif">PP</text>
    </svg>
  `

  const filename = `icon-${size}x${size}.png`
  const filepath = path.join(publicDir, filename)

  await sharp(Buffer.from(svgImage))
    .png()
    .toFile(filepath)

  console.log(`✓ Generated ${filename}`)
}

async function generateScreenshot() {
  const svgImage = `
    <svg width="540" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="540" height="720" fill="url(#grad)"/>
      <text x="270" y="360" font-size="120" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central" font-family="system-ui, -apple-system, sans-serif">PortPal</text>
    </svg>
  `

  const filepath = path.join(publicDir, 'screenshot-540x720.png')

  await sharp(Buffer.from(svgImage))
    .png()
    .toFile(filepath)

  console.log('✓ Generated screenshot-540x720.png')
}

async function main() {
  try {
    await generateIcon(192)
    await generateIcon(512)
    await generateScreenshot()
    console.log('\n✓ All PWA icons generated successfully!')
  } catch (error) {
    console.error('Error generating icons:', error)
    process.exit(1)
  }
}

main()
