-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))

local Roact = TS.import(script, TS.getModule(script, "@rbxts", "roact").src)
local RoactRodux = TS.import(script, TS.getModule(script, "@rbxts", "roact-rodux").src)

local _flipper = TS.import(script, TS.getModule(script, "@rbxts", "flipper").src)
local SingleMotor = _flipper.SingleMotor
local Spring = _flipper.Spring

local function RegionNotifier(props)
	local lastRegion, updateLastRegion = Roact.createBinding("N/A")
	
	local frameMotor = SingleMotor.new(0)
	local frameBinding, updateFrameBinding = Roact.createBinding(frameMotor:getValue())
	
	local regionMotor = SingleMotor.new(1)
	local regionBinding, updateRegionBinding = Roact.createBinding(regionMotor:getValue())
	
	local descriptionMotor = SingleMotor.new(-1)
	local descriptionBinding, updateDescriptionBinding = Roact.createBinding(descriptionMotor:getValue())
	
	frameMotor:onStep(updateFrameBinding)
	regionMotor:onStep(updateRegionBinding)
	descriptionMotor:onStep(updateDescriptionBinding)
	
	if props.myRegion ~= lastRegion:getValue() then
		updateLastRegion(props.myRegion)
		
		frameMotor:setGoal(Spring.new(1.5, {
			frequency = 0.7,
		}))
		
		local connection
		connection = frameMotor:onComplete(function()
			regionMotor:setGoal(Spring.new(0, {
				frequency = 0.7,
			}))
			connection:disconnect()
		end)
		
		local connection2
		connection2 = regionMotor:onComplete(function()
			descriptionMotor:setGoal(Spring.new(0, {
				frequency = 0.5,
			}))
			task.wait(6)
			descriptionMotor:setGoal(Spring.new(-1, {
				frequency = 0.5,
			}))
			task.wait(1)
			regionMotor:setGoal(Spring.new(1, {
				frequency = 0.5,
			}))
			task.wait(1)
			frameMotor:setGoal(Spring.new(0, {
				frequency = 0.7,
			}))
			connection2:disconnect()
		end)
	end
	
	return Roact.createFragment({
		RegionNotifier = Roact.createElement("Frame", {
			Position = UDim2.fromScale(0.402, 0.012),
			Size = UDim2.fromScale(0.195, 0.168),
			BackgroundTransparency = 1,
		}, {
			Middle = Roact.createElement("ImageLabel", {
				AnchorPoint = Vector2.new(0.5, 0),
				Position = UDim2.fromScale(0.5, 0.5),
				Size = frameBinding:map(function(value)
					return UDim2.fromScale(value, 0.02)
				end),
				BackgroundTransparency = 1,
				BackgroundColor3 = Color3.fromRGB(255, 255, 255),
				BorderSizePixel = 0,
				Image = "rbxassetid://7198153486",
				ImageTransparency = 0.2,
			}),
			Region = Roact.createElement("Frame", {
				Position = UDim2.fromScale(0.015, 0.2),
				Size = UDim2.fromScale(0.971, 0.3),
				BackgroundTransparency = 1,
				ClipsDescendants = true,
			}, {
				Roact.createElement("TextLabel", {
					Position = regionBinding:map(function(value)
						return UDim2.fromScale(0, value)
					end),
					Size = UDim2.fromScale(1, 1),
					BackgroundTransparency = 1,
					Font = props.Font or Enum.Font.SpecialElite,
					Text = props.myRegion,
					TextColor3 = props.RegionColor or Color3.fromRGB(255, 255, 255),
					TextScaled = true,
					TextStrokeTransparency = 0.9,
				}),
			}),
			Description = Roact.createElement("Frame", {
				Position = UDim2.fromScale(0.015, 0.54),
				Size = UDim2.fromScale(0.971, 0.25),
				BackgroundTransparency = 1,
				ClipsDescendants = true,
			}, {
				Roact.createElement("TextLabel", {
					Position = descriptionBinding:map(function(value)
						return UDim2.fromScale(0, value)
					end),
					Size = UDim2.fromScale(1, 0.767),
					BackgroundTransparency = 1,
					Font = props.Font2 or Enum.Font.SourceSansItalic,
					TextColor3 = props.BackgroundColor or Color3.fromRGB(0, 0, 0),
					TextScaled = true,
					TextStrokeTransparency = 0.9,
				}),
			}),
		}),
	})
end

local mapStateToProps = function(state, props)
	return {
		myRegion = state.myRegion,
	}
end

return RoactRodux.connect(mapStateToProps)(RegionNotifier)
