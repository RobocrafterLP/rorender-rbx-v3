import mount from "ui/mount";

const toolbar = plugin.CreateToolbar("RoRender V3");
const button = toolbar.CreateButton("RoRender V3", "Made by StrategicPlayZ. Inspired by reteach and Widgeon.", "rbxassetid://5829220477");
const dockSettings = new DockWidgetPluginGuiInfo(
    Enum.InitialDockState.Left,
    false,
    false,
    200,
    300,
    600,
    800
)

const dockWindow = plugin.CreateDockWidgetPluginGui("RoRender V3", dockSettings)
dockWindow.Name = "RoRender V3"
dockWindow.Title = "RoRender V3"

button.Click.Connect(() => {
    dockWindow.Enabled = !dockWindow.Enabled
});

mount(dockWindow)