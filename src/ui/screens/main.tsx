import React from "@rbxts/react";
import { useState } from "@rbxts/react";
import { Screens } from "ui/constants";
import uiConstants from "ui/ui-constants";
import { StartScreen } from "./start-screen";
import { RenderConfigScreen } from "./render-config-screen";
import { RenderProgressScreen } from "./rendering-progress-screen";
import { ErrorScreen } from "./error-screen";
import { WaitScreen } from "./wait-screen";


export interface ProgressUpdateData {
    currentProgess: number
    currentStatusText: string
}

export interface ProgressUpdateHooks {
    setCurrentProgress: React.Dispatch<React.SetStateAction<number>>
    setCurrentStatusText: (status: string) => void
    renderComplete: () => void
    errorOccured: (errMsg: string) => void
}

export function Main() {
    const [selectedScreen, setSelectedScreen] = useState(Screens.Home);

    const changeScreen = (screen: Screens) => {
        setSelectedScreen(screen);
    }

    const [currentProgess, setCurrentProgress] = useState(0);
    const [currentStatusText, setCurrentStatusText] = useState("");
    const [currentErrorText, setCurrentErrorText] = useState("");
    const [currentWaitText, setCurrentWaitText] = useState("");

    const renderComplete = () => {
        task.wait(5)
        changeScreen(Screens.Configuration)
    }

    const errorOccured = (errMsg: string) => {
        changeScreen(Screens.Error)
        setCurrentErrorText(errMsg)
    }

    const waitOccured = (errMsg: string) => {
        changeScreen(Screens.Wait)
        setCurrentWaitText(errMsg)
    }

    const progressUpdateHooks: ProgressUpdateHooks = {
        setCurrentProgress,
        setCurrentStatusText: (input: string) => {
            setCurrentStatusText(input)
            task.wait()
        },
        renderComplete,
        errorOccured
    }

    const progressUpdateData: ProgressUpdateData = {
        currentProgess,
        currentStatusText
    }

    const renderedScreen = () => {
        switch(selectedScreen){
            case Screens.Home:
                return <StartScreen changeScreen={changeScreen} errorMessage={errorOccured} waitOccured={waitOccured}/>
            case Screens.Configuration:
                return <RenderConfigScreen changeScreen={changeScreen} progressHooks={progressUpdateHooks} errorOccured={errorOccured} waitOccured={waitOccured}/>
            case Screens.Rendering:
                return <RenderProgressScreen changeScreen={changeScreen} progressData={progressUpdateData} />
            case Screens.Error:
                return <ErrorScreen changeScreen={changeScreen} errorText={currentErrorText} />
        }
    }

    return (
        <frame
            Size={UDim2.fromScale(1,1)}
            BackgroundColor3={uiConstants.groundColor}
        >
            <frame
                Size={new UDim2(1,-50,1,-50)}
                Position={UDim2.fromScale(.5,.5)}
                AnchorPoint={new Vector2(.5,.5)}
                BackgroundTransparency={1}
            >
                {renderedScreen()}
            </frame>
        </frame>
	);
}
