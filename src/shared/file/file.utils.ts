import { Settings } from 'shared/settings/settings.model'
import { FILE_FORMAT_DATA_ORDER, HEADER_DATA_SIZE, ImageBuffers, RORENDER_FILE_VERSION, STRING_ENCODING_SEPERATOR } from './file.modal'
import { Pixel } from 'shared/render/render.model'
import { getImageDimensions } from 'shared/utils'

export function writeHeader(imageSize: Vector2): buffer {
    const buf = buffer.create(HEADER_DATA_SIZE)
    buffer.writeu16(buf, 0, RORENDER_FILE_VERSION) // Version 1
    buffer.writeu16(buf, 2, imageSize.X) // Version 1
    buffer.writeu16(buf, 4, imageSize.Y) // Version 1
    return buf
}

export const generateBufferChannels = (settings: Settings, isRow: boolean = false): ImageBuffers => {
    const imageSize = getImageDimensions(settings)
    const bytesPerChannel = isRow ? imageSize.X : imageSize.X * imageSize.Y
    if (bytesPerChannel * 8 > 1073741824) {
        warn("Current max image size is 1GB, or 11,585px x 11,585px. If your use case requires a larger image, please make a feature request at rorender.com/support. In the meantime consider tiling your map into smaller chunks to achieve desired resolution.")
        throw "Image too large"
    }
    return {
        red: buffer.create(bytesPerChannel),
        green: buffer.create(bytesPerChannel),
        blue: buffer.create(bytesPerChannel),
        opacity: buffer.create(bytesPerChannel),
    }
}

export const writePixelToImageBuffer = (offset: number, pixel: Pixel, imageBuffers: ImageBuffers): void => {
    buffer.writeu8(imageBuffers.red, offset, pixel.r)
    buffer.writeu8(imageBuffers.green, offset, pixel.g)
    buffer.writeu8(imageBuffers.blue, offset, pixel.b)
    buffer.writeu8(imageBuffers.opacity, offset, pixel.h)
}

const getFileSizeFromBuffers = (imageBuffers: ImageBuffers): number => {
    let output = 0
    for (let key of FILE_FORMAT_DATA_ORDER) {
        output += buffer.len(imageBuffers[key])
    }
    return output
}

export const mergeImageDataIntoSingleData = (imageData: Array<Array<number>>): Array<number> => {
    let output = []
    for (let row of imageData) {
        for (let data of row) {
            output.push(data)
        }
    }
    return output
}

export const mergeImageBuffersIntoSingleBuffer = (imageData: ImageBuffers): buffer => {
    let totalSize = getFileSizeFromBuffers(imageData)
    const output = buffer.create(totalSize)

    let currentOffset = 0
    for (let item of FILE_FORMAT_DATA_ORDER) {
        buffer.copy(output, currentOffset, imageData[item], 0, buffer.len(imageData[item]))
        currentOffset += buffer.len(imageData[item])
    }
    return output
}
