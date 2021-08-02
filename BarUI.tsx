// SERVICES
import { Players, TweenService } from "@rbxts/services";

// MODULES
import Roact, { Binding } from "@rbxts/roact";
import { Spring, SingleMotor } from "@rbxts/flipper";

// VARIABLES
const player = Players.LocalPlayer;
const character = player.Character || player.CharacterAdded.Wait()[0];
const humanoid = character.WaitForChild("Humanoid") as Humanoid;

// FUNCTIONS
function map(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
	return ((outMax - outMin) * (x - inMin)) / (inMax - inMin) + outMin;
}

function oneOverProgressFunction(progress: number) {
	const oneOverProgress = progress === 0 ? 0 : 1 / progress;
	return oneOverProgress;
}

interface BarData {
	Name: string;
	Size: UDim2 | Binding<UDim2>;
	Size2: UDim2 | Binding<UDim2>;
	Position: UDim2 | Binding<UDim2>;
	OverlaySize: UDim2 | Binding<UDim2>;
	Overlay2Size: UDim2 | Binding<UDim2>;
	Overlay2Color: Color3;
	Image: string;
}

function Bar(Data: BarData) {
	return (
		<Roact.Fragment>
			<frame
				Key={Data.Name}
				Position={Data.Position}
				Size={Data.Size}
				BackgroundTransparency={1}
				ClipsDescendants={true}
			>
				<imagelabel
					Key={Data.Name}
					Position={UDim2.fromScale(0, 0)}
					Size={Data.OverlaySize}
					Image={Data.Image}
					BackgroundTransparency={1}
				/>
			</frame>
			<frame
				Key={`Damage ${Data.Name}`}
				Position={Data.Position}
				Size={Data.Size2}
				BackgroundTransparency={1}
				ClipsDescendants={true}
			>
				<imagelabel
					Key={Data.Name}
					Position={UDim2.fromScale(0, 0)}
					Size={Data.Overlay2Size}
					Image={Data.Image}
					BackgroundTransparency={1}
					ImageColor3={Data.Overlay2Color}
					ZIndex={0}
				/>
			</frame>
		</Roact.Fragment>
	);
}

function Bars() {
	const healthMotor = new SingleMotor(100);
	const damageHealthMotor = new SingleMotor(100);

	const [health, updateHealth] = Roact.createBinding(healthMotor.getValue());
	const [damageHealth, updateDamageHealth] = Roact.createBinding(damageHealthMotor.getValue());

	const maxHealth = 100;
	healthMotor.onStep(updateHealth);
	damageHealthMotor.onStep(updateDamageHealth);

	humanoid.HealthChanged.Connect((newHealth) => {
		healthMotor.setGoal(
			new Spring(newHealth, {
				frequency: 1,
			}),
		);
		damageHealthMotor.setGoal(
			new Spring(newHealth, {
				frequency: 0.01,
			}),
		);
	});

	return (
		<screengui>
			<frame
				Size={UDim2.fromScale(0.335, 0.211)}
				Position={UDim2.fromScale(0.006, 0.762)}
				BackgroundTransparency={1}
			>
				<imagelabel
					Key={"Background"}
					Position={UDim2.fromScale(0.018, 0.071)}
					Size={UDim2.fromScale(0.96, 0.857)}
					Image={"rbxassetid://7179258838"}
					BackgroundTransparency={1}
					ZIndex={-1}
				/>
				<Bar
					Name={"Healthbar"}
					Position={UDim2.fromScale(0.266, 0.286)}
					Image={"rbxassetid://7192049692"}
					Size={health.map((newHealth) => {
						return UDim2.fromScale((newHealth / maxHealth) * 0.619, 0.159);
					})}
					Size2={health.map((newHealth) => {
						return UDim2.fromScale((newHealth / maxHealth) * 0.619, 0.159);
					})}
					OverlaySize={health.map((newHealth) => {
						return UDim2.fromScale(oneOverProgressFunction(newHealth / maxHealth), 1);
					})}
					Overlay2Size={health.map((newHealth) => {
						return UDim2.fromScale(oneOverProgressFunction(newHealth / maxHealth), 1);
					})}
					Overlay2Color={Color3.fromRGB(154, 0, 0)}
				/>
			</frame>
		</screengui>
	);
}

/*
<Bar
					Name={"Staminabar"}
					Position={UDim2.fromScale(0.274, 0.468)}
					Size={UDim2.fromScale(0.537, 0.127)}
					//Position2={UDim2.fromScale(-0.472, -3.116)}
					OverlaySize={UDim2.fromScale(1.789, 6.75)}
					Image={"rbxassetid://7179258642"}
				/>
				<Bar
					Name={"Expbar"}
					Position={UDim2.fromScale(0.254, 0.683)}
					Size={UDim2.fromScale(0.503, 0.119)}
					//Position2={UDim2.fromScale(-0.47, -5.129)}
					OverlaySize={UDim2.fromScale(1.91, 7.2)}
					Image={"rbxassetid://7179258773"}
				/>*/

export = Bars;
