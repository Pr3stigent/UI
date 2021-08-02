import { Players } from "@rbxts/services";

import Roact, { Binding } from "@rbxts/roact";
import { Spring, SingleMotor } from "@rbxts/flipper";

const player = Players.LocalPlayer;
const character = player.Character || player.CharacterAdded.Wait()[0];
const humanoid = character.WaitForChild("Humanoid") as Humanoid;

function map(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
	return ((outMax - outMin) * (x - inMin)) / (inMax - inMin) + outMin;
}

function oneOverProgressFunction(progress: number) {
	const oneOverProgress = progress === 0 ? 0 : 1 / progress;
	return oneOverProgress;
}

type BarData = {
	Name: string;
	Position: UDim2 | Binding<UDim2>;
	Image: string;
	SpringOptions?: {};
	SpringOptions2?: {};
	Changed: RBXScriptSignal;
	MaxValue: number;
	ClippingData: {
		SizeX: number;
		SizeY: number;
	};
	OverlayData: {
		SizeX?: number;
		SizeY: number;
	};
	Overlay2Color: Color3;
};

function Bar(data: BarData) {
	const motor = new SingleMotor(100);
	const motor2 = new SingleMotor(100);

	const [binding, updateBinding] = Roact.createBinding(motor.getValue());
	const [binding2, updateBinding2] = Roact.createBinding(motor2.getValue());

	motor.onStep(updateBinding);
	motor2.onStep(updateBinding2);

	data.Changed.Connect((value) => {
		motor.setGoal(new Spring(value, data.SpringOptions));
		print("e");
		task.delay(2, () => {
			print("e2");
			return motor2.setGoal(new Spring(value, data.SpringOptions2));
		});
	});

	return (
		<>
			<frame
				Key={data.Name}
				Position={data.Position}
				Size={binding.map((value) => {
					return UDim2.fromScale((value / data.MaxValue) * data.ClippingData.SizeX, data.ClippingData.SizeY);
				})}
				BackgroundTransparency={1}
				ClipsDescendants
			>
				<imagelabel
					Key={data.Name}
					Position={UDim2.fromScale(0, 0)}
					Size={binding.map((value) => {
						return UDim2.fromScale(oneOverProgressFunction(value / data.MaxValue), data.OverlayData.SizeY);
					})}
					Image={data.Image}
					BackgroundTransparency={1}
				/>
			</frame>
			<frame
				Key={`Damage ${data.Name}`}
				Position={data.Position}
				Size={binding2.map((value) => {
					return UDim2.fromScale((value / data.MaxValue) * data.ClippingData.SizeX, data.ClippingData.SizeY);
				})}
				BackgroundTransparency={1}
				ClipsDescendants
			>
				<imagelabel
					Key={data.Name}
					Position={UDim2.fromScale(0, 0)}
					Size={binding2.map((value) => {
						return UDim2.fromScale(oneOverProgressFunction(value / data.MaxValue), data.OverlayData.SizeY);
					})}
					Image={data.Image}
					BackgroundTransparency={1}
				/>
			</frame>
		</>
	);
}

function Bars() {
	const MAX_HEALTH = 100;

	return (
		<screengui>
			<frame
				Size={UDim2.fromScale(0.335, 0.211)}
				Position={UDim2.fromScale(0.006, 0.762)}
				BackgroundTransparency={1}
			>
				<imagelabel
					Key={"Background"}
					Position={UDim2.fromScale(0.024, 0.071)}
					Size={UDim2.fromScale(0.938, 0.857)}
					Image={"rbxassetid://7179258838"}
					BackgroundTransparency={1}
					ZIndex={-1}
				/>
				<Bar
					Name={"Healthbar"}
					Position={UDim2.fromScale(0.266, 0.286)}
					Image={"rbxassetid://7192049692"}
					Changed={humanoid.HealthChanged}
					SpringOptions={{ frequency: 2, dampeningRatio: 1 }}
					SpringOptions2={{ frequency: 1, dampeningRatio: 1 }}
					MaxValue={MAX_HEALTH}
					ClippingData={{ SizeX: 0.6, SizeY: 0.159 }}
					OverlayData={{ SizeY: 1 }}
					Overlay2Color={Color3.fromRGB(154, 0, 0)}
				/>
			</frame>
		</screengui>
	);
}

export = Bars;
