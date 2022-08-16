import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

const ReplicatedStorage = game.GetService("ReplicatedStorage")
const KeyframeService = game.GetService("KeyframeSequenceProvider")

@Component({
  tag: "stephens-tool",
})
export class StephensTool extends BaseComponent implements OnStart {
    private swingTrack?: AnimationTrack

    onStart() {
        const keyframeSequence = ReplicatedStorage.FindFirstChild("Swing") as KeyframeSequence
        if (!keyframeSequence) return

        const hashID = KeyframeService.RegisterKeyframeSequence(keyframeSequence)
        const swingAnimation = new Instance("Animation")
        swingAnimation.Name = "Swing"
        swingAnimation.AnimationId = hashID

        if (!this.instance.IsA("Tool")) return

        this.instance.Equipped.Connect(() => {
          print("Equipped")
          const character = this.instance.Parent as Model
          if (!character) return
          const humanoid = character.FindFirstChild("Humanoid") as Humanoid
          if (!humanoid) return
          const swingTrack = humanoid.LoadAnimation(swingAnimation)
          this.swingTrack = swingTrack
        })
        this.instance.Unequipped.Connect(() => {
          print("Unequipped")
        })
        this.instance.Activated.Connect(() => {
          print("Activated")
          if (!this.swingTrack) return
          this.swingTrack.Play()
        })
    }
}