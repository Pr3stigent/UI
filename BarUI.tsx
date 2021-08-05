import Roact from "@rbxts/roact";
import RoactRodux, { connect } from "@rbxts/roact-rodux";
import flipper, { SingleMotor, Spring } from "@rbxts/flipper";

import Actions from "client/Roact/Rodux/Actions";
import Store from "client/Roact/Rodux/StoreTypes";

type Props = {
	myRegion?: string;
	Font: Enum.Font;
	Font2?: Enum.Font;
	RegionColor?: Color3;
	BackgroundColor?: Color3;
};

function RegionNotifier(props: Props) {
	const [lastRegion, updateLastRegion] = Roact.createBinding("N/A");

	const frameMotor = new SingleMotor(0);
	const [frameBinding, updateFrameBinding] = Roact.createBinding(frameMotor.getValue());

	const regionMotor = new SingleMotor(1);
	const [regionBinding, updateRegionBinding] = Roact.createBinding(regionMotor.getValue());

	const descriptionMotor = new SingleMotor(-1);
	const [descriptionBinding, updateDescriptionBinding] = Roact.createBinding(descriptionMotor.getValue());

	frameMotor.onStep(updateFrameBinding);
	regionMotor.onStep(updateRegionBinding);
	descriptionMotor.onStep(updateDescriptionBinding);

	if (props.myRegion !== lastRegion.getValue()) {
		updateLastRegion(props.myRegion as string);
		frameMotor.setGoal(
			new Spring(1.5, {
				frequency: 0.7,
			}),
		);

		const connection = frameMotor.onComplete(() => {
			regionMotor.setGoal(
				new Spring(0, {
					frequency: 0.7,
				}),
			);
			connection.disconnect();
		});

		const connection2 = regionMotor.onComplete(() => {
			descriptionMotor.setGoal(
				new Spring(0, {
					frequency: 0.5,
				}),
			);
			task.wait(6);
			descriptionMotor.setGoal(
				new Spring(-1, {
					frequency: 0.5,
				}),
			);
			task.wait(1);
			regionMotor.setGoal(
				new Spring(1, {
					frequency: 0.5,
				}),
			);
			task.wait(1);
			frameMotor.setGoal(
				new Spring(0, {
					frequency: 0.7,
				}),
			);

			connection2.disconnect();
		});
	}

	return (
		<frame
			Key={"RegionNotifier"}
			Position={UDim2.fromScale(0.402, 0.012)}
			Size={UDim2.fromScale(0.195, 0.168)}
			BackgroundTransparency={1}
		>
			<imagelabel
				Key={"Middle"}
				AnchorPoint={new Vector2(0.5, 0)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={frameBinding.map((value) => {
					return UDim2.fromScale(value, 0.02);
				})}
				BackgroundTransparency={1}
				BackgroundColor3={Color3.fromRGB(255, 255, 255)}
				BorderSizePixel={0}
				Image={"rbxassetid://7198153486"}
				ImageTransparency={0.2}
			></imagelabel>
			<frame
				Key={"Region"}
				Position={UDim2.fromScale(0.015, 0.2)}
				Size={UDim2.fromScale(0.971, 0.3)}
				BackgroundTransparency={1}
				ClipsDescendants
			>
				<textlabel
					Position={regionBinding.map((value) => {
						return UDim2.fromScale(0, value);
					})}
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					Font={props.Font || Enum.Font.SpecialElite}
					Text={props.myRegion}
					TextColor3={props.RegionColor || Color3.fromRGB(255, 255, 255)}
					TextScaled
					TextStrokeTransparency={0.9}
				></textlabel>
			</frame>
			<frame
				Key={"Description"}
				Position={UDim2.fromScale(0.015, 0.54)}
				Size={UDim2.fromScale(0.971, 0.25)}
				BackgroundTransparency={1}
				ClipsDescendants
			>
				<textlabel
					Position={descriptionBinding.map((value) => {
						return UDim2.fromScale(0, value);
					})}
					Size={UDim2.fromScale(1, 0.767)}
					BackgroundTransparency={1}
					Font={props.Font2 || Enum.Font.SourceSansItalic}
					TextColor3={props.BackgroundColor || Color3.fromRGB(0, 0, 0)}
					TextScaled
					TextStrokeTransparency={0.9}
				></textlabel>
			</frame>
		</frame>
	);
}

const mapStateToProps = (state: Store, props: {}) => {
	return {
		myRegion: state.myRegion,
	};
};

export = RoactRodux.connect(mapStateToProps)(RegionNotifier);
