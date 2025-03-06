export interface Settings {
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