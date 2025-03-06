import { Screens } from "ui/constants"
import { ProgressUpdateHooks } from "./main"
import { useEffect, useState } from "@rbxts/react"
import { autoConfigureBoundingBox, getCurrentRender, QuickSelect, QuickSelectModule, setUpdaters, unloadRender } from "ui/config-helper"
import { Button, ButtonType } from "ui/button"
import React from "@rbxts/react"
import uiConstants from "ui/ui-constants"
import { RenderProperty } from "ui/render-property"
import { Settings } from "shared/settings/settings.model"
import { runRender } from "server/render-runner"

const httpService = game.GetService('HttpService')

export function RenderConfigScreen(props: {
    changeScreen: (screen: Screens) => void,
    progressHooks: ProgressUpdateHooks
    errorOccured: (message: string) => void
    waitOccured: (message: string) => void
}) {
    const [renderId, setRenderId] = useState<undefined | string>(undefined)
    const [imageSize, setImageSize] = useState<string>("")
    const [scale, setScale] = useState<string>("")
    const [data, setData] = useState<string>("")

    const closeScreen = () => {
        props.changeScreen(Screens.Home)
    }

    const canRender = () => {
        // const [httpSuccess, errorMsg] = pcall(() => {
        //     return httpService.GetAsync("http://localhost:8081/")
        // })

        return {httpSuccess: true, errorMsg: ""}
    }

    useEffect(() => {
        setUpdaters(setImageSize, setScale, setData, closeScreen)
    }, [])

	return (
        <frame
            Size={UDim2.fromScale(1,1)}
            BackgroundTransparency={1}
        >
            <uilistlayout
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                VerticalAlignment={Enum.VerticalAlignment.Center}
                Padding={new UDim(0,uiConstants.spacingNormal)}
                SortOrder={Enum.SortOrder.LayoutOrder}
            />

            <textlabel
                TextColor3={uiConstants.blackText}
                BackgroundTransparency={1}
                Font={uiConstants.boldFont}
                Text={"Quick Select"}
                Size={new UDim2(1,0,0,15)}
                TextSize={uiConstants.fontSizeNormal}
                TextXAlignment={Enum.TextXAlignment.Left}
                AnchorPoint={new Vector2(.5, .5)}
            />
            <frame
                BackgroundTransparency={1}
                Size={new UDim2(1,0,0,110)}
            >
                <uilistlayout
                    HorizontalAlignment={Enum.HorizontalAlignment.Center}
                    VerticalAlignment={Enum.VerticalAlignment.Center}
                    Padding={new UDim(0,uiConstants.spacingNormal)}
                />
                <frame
                    BackgroundTransparency={1}
                    Size={new UDim2(1,0,0,30)}
                >
                    <uilistlayout
                        HorizontalAlignment={Enum.HorizontalAlignment.Center}
                        VerticalAlignment={Enum.VerticalAlignment.Center}
                        FillDirection={Enum.FillDirection.Horizontal}
                        Padding={new UDim(0,uiConstants.spacingNormal)}
                    />
                    <Button label="Corner 1" buttonType={ButtonType.outline} size={new UDim2(.5,-5,0,30)} clicked={() => QuickSelectModule(QuickSelect.C1)} />
                    <Button label="Corner 2" buttonType={ButtonType.outline} size={new UDim2(.5,-5,0,30)} clicked={() => QuickSelectModule(QuickSelect.C0)} />
                </frame>
                <Button label="Settings Module" buttonType={ButtonType.outline} size={new UDim2(1,0,0,30)} clicked={() => QuickSelectModule(QuickSelect.Module)} />
                <Button label="Auto Configure" buttonType={ButtonType.outline} size={new UDim2(1,0,0,30)} clicked={() => autoConfigureBoundingBox()} />
            </frame>
            <frame
                BackgroundTransparency={1}
                Size={new UDim2(1,0,0,5)}
            />
            <Button label="Start Render" buttonType={ButtonType.filled} size={new UDim2(1, 0, 0, 30)} clicked={() => {
                print("Start Render")
                props.changeScreen(Screens.Wait)
                const { httpSuccess, errorMsg } = canRender()
                if (httpSuccess) {
                    props.changeScreen(Screens.Rendering)
                    try {
                        runRender(
                            require((getCurrentRender() as ModuleScript).Clone()) as Settings,
                            props.progressHooks
                        )
                    } catch (e) {
                        props.errorOccured(e as string);
                    }
                } else {
                    props.errorOccured(`Did you enable Http requests and start the RoRenderV3 server? Error: ${errorMsg}`)
                }
            }}/>
            <Button label="Detach Configuration" buttonType={ButtonType.outline} size={new UDim2(1,0,0,30)} clicked={() => {
                unloadRender()
                props.changeScreen(Screens.Home)
            }}/>
            <textlabel
                TextColor3={uiConstants.blackText}
                BackgroundTransparency={1}
                Font={uiConstants.boldFont}
                Text={"Stats"}
                Size={new UDim2(1,0,0,15)}
                TextSize={uiConstants.fontSizeNormal}
                TextXAlignment={Enum.TextXAlignment.Left}
                AnchorPoint={new Vector2(.5, .5)}
            />
            <frame
                BackgroundColor3={uiConstants.cardColor}
                Size={new UDim2(1,0,0,85)}
            >
                <uicorner CornerRadius={new UDim(0,uiConstants.cornerRadius)} />
                <frame
                    Size={new UDim2(1,-15, 1, -15)}
                    BackgroundTransparency={1}
                    AnchorPoint={new Vector2(.5,.5)}
                    Position={UDim2.fromScale(.5,.5)}
                >
                    <uilistlayout
                        HorizontalAlignment={Enum.HorizontalAlignment.Center}
                        VerticalAlignment={Enum.VerticalAlignment.Top}
                        Padding={new UDim(0,uiConstants.spacingSmall)}
                    />
                    <RenderProperty size={new UDim2(1,0,0,20)} property="Image Size" value={imageSize} />
                    <RenderProperty size={new UDim2(1,0,0,20)} property="Scale" value={scale} />
                    <RenderProperty size={new UDim2(1,0,0,20)} property="Raw Data" value={data} />
                </frame>
            </frame>
        </frame>
	);
}
