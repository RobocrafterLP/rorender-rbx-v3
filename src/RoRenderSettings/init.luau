--!strict
-- // RoRenderV3 Settings \\ --
-- // By StrategicPlayZ \\ --
-- Inspired by reteach and Widgeon.

local RoRenderSettings = {} :: {
	MapCFrame: CFrame,
	MapSize: Vector3,

	NumActors: number,

	Resolution: number,

	ShadowsSettings: {
		ShadowsEnabled: boolean,

		ShadowOpacity: number,

		ShadowRayLength: number,

		TowardsSun: CFrame,

		SmoothShadowsSettings: {
			SmoothShadowsEnabled: boolean,
			SmoothShadowRaysConeAngle: number,
			NumSmoothShadowRays: number,
		},
	},

	RaycastParams: RaycastParams,
}

local Draggers = script.Draggers

-- // SETTINGS \\ --
-- Make sure not to enter any invalid settings, as there are currently no validation checks.

--[[

::IMPORTANT::
	MAKE SURE TO ENABLE HTTP REQUESTS BY RUNNING THE FOLLOWING CODE IN THE COMMAND BAR AT THE BOTTOM:
		game:GetService("HttpService").HttpEnabled = true

]]

-- A CFrame of the center of the map/area as well as its rotation.
RoRenderSettings.MapCFrame = Draggers.Center.CFrame

-- A Vector3 of the size of the map/area you want to render.
-- Each component should be an integer.
-- If in decimal, will be automatically rounded upwards (away from zero).
RoRenderSettings.MapSize = Draggers.Center.Mesh.Scale

-- The number of actors the rendering is divided into.
-- This number should be greater than the number of cores or logical processors your computer has.
-- A number of 50 should probably suffice for most cases.
-- If in task manager Studio is using 90% of your CPU while rendering, you do not need to increase this
-- number, and it will have little effect on render speed if you do.
-- Beware that a higher number also requires a higher amount of free RAM available because each actor
-- stores its pixel data until all the actors have completed, so a higher actor count will take more
-- RAM.
-- You should observe the RAM usage in task manager if you increase this number.
RoRenderSettings.NumActors = 50

-- Adjusts the size and the accuracy of the rendered image.
-- Rendered image size = [ ((MapSize * Resolution) + 1) ] (May vary by 1 pixel.)
RoRenderSettings.Resolution = 1

-- Settings to adjust the shadows in the rendered map.
RoRenderSettings.ShadowsSettings = {
	-- Are shadows enabled? If false, there will be no shadows rendered on the map.
	ShadowsEnabled = true,

	-- The opacity of a shadow (how opaque the shadow is).
	-- 0 = invisible. (do not use this setting, instead set ShadowsEnabled to false)
	-- 0.5 = half opaque.
	-- 1 = fully opaque.
	ShadowOpacity = 0.3,

	-- The length of each shadow ray. If this number is too small, tall objects will not cast shadows properly.
	-- Higher numbers equal slower rendering.
	ShadowRayLength = 300,

	-- A CFrame at (0, 0, 0) pointing towards the sun.
	TowardsSun = CFrame.lookAt(Vector3.new(), game:GetService("Lighting"):GetSunDirection()),

	-- Settings to adjust the smooth shadows in the rendered map.
	SmoothShadowsSettings = {
		-- Are smooth shadows enabled? If false, shadows will be sharp.
		-- Enabling this slows down rendering (quite a bit), but the shadows are more realistic and not sharp.
		SmoothShadowsEnabled = true,

		-- Controls the SIZE of the shadow fade zone (NOT the smoothness).
		-- This number should stay between 1 degree and 89 degrees.
		-- The default value (10 degrees) should be fine for most cases.
		SmoothShadowRaysConeAngle = 10, -- Degrees

		-- Controls the SMOOTHNESS of the shadow fade zone (NOT the size).
		-- Higher numbers equal slower rendering.
		-- This should not be lower than 4.
		NumSmoothShadowRays = 6,
	},
}

-- You can make changes to this RaycastParams object to make the renderer ignore parts, water, etc.
-- https://create.roblox.com/docs/reference/engine/datatypes/RaycastParams
RoRenderSettings.RaycastParams = RaycastParams.new()
RoRenderSettings.RaycastParams.FilterType = Enum.RaycastFilterType.Exclude --for not rendering on the image.

return RoRenderSettings
