import { Settings } from 'shared/settings/settings.model'
import { Pixel, RenderConstants, VIEWFINDER_IMAGE_SIZE } from './render.model'
import { ImageBuffers } from 'shared/file/file.modal'
import { WorkerPool } from './actor-pool.handler'
import { generateBufferChannels } from 'shared/file/file.utils'
import { computePixel, delayForScriptExhuastion } from './render.utils'
import { ActorMessage, COMPUTE_ROW_MESSAGE } from './actor.model'
import { ProgressUpdateHooks } from 'ui/screens/main'
import { getImageDimensions } from 'shared/utils'

const meshPixels = script.Parent?.Parent?.Parent?.FindFirstChild("threads")?.FindFirstChild("meshPixel") as BindableEvent

export async function render(settings: Settings, progressHooks: ProgressUpdateHooks): Promise<Array<Array<number>>> {
    const imageDimensions = getImageDimensions(settings)
    const renderConstants = getRenderConstants(settings, imageDimensions)

    const pool = new WorkerPool(settings)

    const calculatedRows: Array<Array<number>> = []
    const allRowsCompleted: Promise<void>[] = []

    let startTime = tick()
    let finishedRows = 0
    let lastRowPrinted = 0

    const meshCalculation: Vector2[] = []
    let counter = 0
    const meshPixelsConnection = meshPixels.Event.Connect((positions: Vector2[]) => {
        counter++
        positions.forEach(pos => meshCalculation.push(pos))
    })
    task.wait(.1) // Allow time for actors to initalize and message recievers to bind to actor parent 
    for (let row = 0; row < imageDimensions.Y; row++) {
        startTime = delayForScriptExhuastion(startTime)
        const actorMessage: ActorMessage = {
            settings,
            row,
            renderConstants
        }
        const rowCompleted = new Promise<void>(async (resolve) => {
            const actor = await pool.getActor(settings)
            const rowCalculatedEvent = actor.FindFirstChild("rowCalculated") as BindableEvent
            const binding = rowCalculatedEvent.Event.Connect((data: Array<number>) => {
                startTime = delayForScriptExhuastion(startTime, 0.2)
                calculatedRows[row] = data
                binding.Disconnect()
                pool.releaseActor(actor)
                finishedRows++
                const currentCompletion = finishedRows / imageDimensions.Y
                if (currentCompletion - lastRowPrinted > 0.05) {
                    //print(`finished rows: ${string.format("%.2f", (finishedRows / imageDimensions.Y) * 100)}%`)
                    progressHooks.setCurrentProgress(finishedRows / imageDimensions.Y)
                    task.wait(.05)
                    lastRowPrinted = currentCompletion
                }
                resolve()
            })
            actor.SendMessage(COMPUTE_ROW_MESSAGE, actorMessage)
        })
        allRowsCompleted.push(rowCompleted)
        //for (let col = 0; col < imageDimensions.X; col++) {
        //    computePixel(new Vector2(col, row),settings, renderConstants)
        //}
    }
    await Promise.all(allRowsCompleted)
    print(counter, "total pixels to be texture counted")

    pool.cleanup()
    meshPixelsConnection.Disconnect()
    const output = calculatedRows

    return output
}

export function spliceTexturedPixelsIn(buffers: ImageBuffers, pixel: Pixel, position: Vector2, imageSize: Vector2) {
        const bufferPosition = position.X + imageSize.X * position.Y
        buffer.writeu8(buffers.red, bufferPosition, pixel.r)
        buffer.writeu8(buffers.green, bufferPosition, pixel.g)
        buffer.writeu8(buffers.blue, bufferPosition, pixel.b)
        buffer.writeu8(buffers.opacity, bufferPosition, pixel.h)
}

export function getRenderMaterialMap(): Map<Enum.Material, number> {
    const materials = Enum.Material.GetEnumItems()
    const materialMap = new Map<Enum.Material, number>()
    let counter = 1 
    materials.forEach(material => {
        materialMap.set(material, counter)
        counter++
    })
    return materialMap
}

function combineAllBuffers(buffs: ImageBuffers[], settings: Settings): ImageBuffers {
    const output = generateBufferChannels(settings)
    const imageDimensions = getImageDimensions(settings)
    for (let i = 0; i < buffs.size(); i++) {
        buffer.writestring(output.red, i * imageDimensions.X, buffer.tostring(buffs[i].red))
        buffer.writestring(output.green, i * imageDimensions.X, buffer.tostring(buffs[i].green))
        buffer.writestring(output.blue, i * imageDimensions.X, buffer.tostring(buffs[i].blue))
        buffer.writestring(output.opacity, i * imageDimensions.X, buffer.tostring(buffs[i].opacity))
    }
    return output
}

function getRenderConstants(settings: Settings, imageDimensions: Vector2): RenderConstants {
    const rayLength = settings.MapSize.Y

    const materialMap = getRenderMaterialMap()

    const mapScale = settings.MapSize
    const mapCFrame = settings.MapCFrame

    const offset = mapScale.mul(new Vector3(-.5, .5, -.5))

    return {
        startingPosition: mapCFrame.mul(new CFrame(offset)),
        rayLength,
        imageDimensions,
        rayVector: settings.MapCFrame.UpVector.mul(-1).mul(rayLength),
        materialMap,
    }
}

