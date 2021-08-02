-- Compiled with roblox-ts v1.2.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, TS.getModule(script, "@rbxts", "services")).Players
local Roact = TS.import(script, TS.getModule(script, "@rbxts", "roact").src)
local _flipper = TS.import(script, TS.getModule(script, "@rbxts", "flipper").src)
local Spring = _flipper.Spring
local SingleMotor = _flipper.SingleMotor
local player = Players.LocalPlayer
local character = player.Character or (player.CharacterAdded:Wait())
local humanoid = character:WaitForChild("Humanoid")
local function map(x, inMin, inMax, outMin, outMax)
	return ((outMax - outMin) * (x - inMin)) / (inMax - inMin) + outMin
end
local function oneOverProgressFunction(progress)
	local oneOverProgress = progress == 0 and 0 or 1 / progress
	return oneOverProgress
end
local function Bar(data)
	local motor = SingleMotor.new(100)
	local motor2 = SingleMotor.new(100)
	local binding, updateBinding = Roact.createBinding(motor:getValue())
	local binding2, updateBinding2 = Roact.createBinding(motor2:getValue())
	motor:onStep(updateBinding)
	motor2:onStep(updateBinding2)
	data.Changed:Connect(function(value)
		motor:setGoal(Spring.new(value, data.SpringOptions))
		print("e")
		task.delay(2, function()
			print("e2")
			return motor2:setGoal(Spring.new(value, data.SpringOptions2))
		end)
	end)
	return Roact.createFragment({
		[data.Name] = Roact.createFragment({
			[data.Name] = Roact.createElement("Frame", {
				Position = data.Position,
				Size = binding:map(function(value)
					return UDim2.fromScale((value / data.MaxValue) * data.ClippingData.SizeX, data.ClippingData.SizeY)
				end),
				BackgroundTransparency = 1,
				ClipsDescendants = true,
			}, {
				[data.Name] = Roact.createElement("ImageLabel", {
					Position = UDim2.fromScale(0, 0),
					Size = binding:map(function(value)
						return UDim2.fromScale(oneOverProgressFunction(value / data.MaxValue), data.OverlayData.SizeY)
					end),
					Image = data.Image,
					BackgroundTransparency = 1,
				}),
			}),
		}),
		["Damage " .. data.Name] = Roact.createFragment({
			["Damage " .. data.Name] = Roact.createElement("Frame", {
				Position = data.Position,
				Size = binding2:map(function(value)
					return UDim2.fromScale((value / data.MaxValue) * data.ClippingData.SizeX, data.ClippingData.SizeY)
				end),
				BackgroundTransparency = 1,
				ClipsDescendants = true,
			}, {
				[data.Name] = Roact.createElement("ImageLabel", {
					Position = UDim2.fromScale(0, 0),
					Size = binding2:map(function(value)
						return UDim2.fromScale(oneOverProgressFunction(value / data.MaxValue), data.OverlayData.SizeY)
					end),
					Image = data.Image,
					BackgroundTransparency = 1,
				}),
			}),
		}),
	})
end
local function Bars()
	local MAX_HEALTH = 100
	return Roact.createElement("ScreenGui", {}, {
		Roact.createElement("Frame", {
			Size = UDim2.fromScale(0.335, 0.211),
			Position = UDim2.fromScale(0.006, 0.762),
			BackgroundTransparency = 1,
		}, {
			Background = Roact.createElement("ImageLabel", {
				Position = UDim2.fromScale(0.024, 0.071),
				Size = UDim2.fromScale(0.938, 0.857),
				Image = "rbxassetid://7179258838",
				BackgroundTransparency = 1,
				ZIndex = -1,
			}),
			Roact.createElement(Bar, {
				Name = "Healthbar",
				Position = UDim2.fromScale(0.266, 0.286),
				Image = "rbxassetid://7192049692",
				Changed = humanoid.HealthChanged,
				SpringOptions = {
					frequency = 2,
					dampeningRatio = 1,
				},
				SpringOptions2 = {
					frequency = 1,
					dampeningRatio = 1,
				},
				MaxValue = MAX_HEALTH,
				ClippingData = {
					SizeX = 0.6,
					SizeY = 0.159,
				},
				OverlayData = {
					SizeY = 1,
				},
				Overlay2Color = Color3.fromRGB(154, 0, 0),
			}),
		}),
	})
end
return Bars
