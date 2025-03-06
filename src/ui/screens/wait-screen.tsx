import React from "@rbxts/react";
import { Screens } from "ui/constants";
import uiConstants from "ui/ui-constants";


export function WaitScreen(props: {
    changeScreen: (screen: Screens) => void
    waitText: string
}) {
    return (
        <frame
            Size={UDim2.fromScale(1,1)}
            BackgroundTransparency={1}
        >
            <uilistlayout
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                VerticalAlignment={Enum.VerticalAlignment.Center}
                Padding={new UDim(0,uiConstants.spacingNormal)}
            />
            <textlabel
                TextColor3={uiConstants.errorText}
                BackgroundTransparency={1}
                Font={uiConstants.boldFont}
                Text={"Waiting For"}
                Size={new UDim2(1,0,0,40)}
                TextScaled={true}
                TextXAlignment={Enum.TextXAlignment.Left}
                AnchorPoint={new Vector2(.5, .5)}
                TextSize={uiConstants.fontSizeBig}
            />
            <frame
                Size={new UDim2(1,0,0,150)}
                BackgroundColor3={uiConstants.cardColor}
                BorderSizePixel={uiConstants.borderSize}
                BorderColor3={uiConstants.borderColor}
            >
                <uicorner CornerRadius={new UDim(0,uiConstants.cornerRadius)} />
                <textlabel
                    TextColor3={uiConstants.blackText}
                    TextXAlignment={Enum.TextXAlignment.Left}
                    TextYAlignment={Enum.TextYAlignment.Top}
                    BackgroundTransparency={1}
                    Text={props.waitText}
                    TextSize={uiConstants.fontSizeNormal}
                    TextWrap={true}
                    AnchorPoint={new Vector2(.5,.5)}
                    Position={UDim2.fromScale(.5,.5)}
                    Font={uiConstants.lessboldFont}
                    Size={new UDim2(1,-10,1,-20)}
                />
            </frame>
        </frame>
    );
}
