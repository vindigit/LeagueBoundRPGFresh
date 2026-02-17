=== coach_aside ===
The whistle echoes in the empty gym. Practice is over, but Coach grabs your arm. "Kid, that last game... you were coasting. Stay late. We're fixing what's broken." # SCENE_START

* [Study Film: "Show me their tendencies."]
    "Smart play," Coach mutters, leading you to the film room. "The game isn't just played with your feet."
    -> study_film
* [Conditioning: "Give me the suicides."]
    Coach smiles grimly. "That's heart. Hit the baseline. Don't stop till you're gasping."
    -> extra_sprints

=== study_film ===
Hours vanish. Your eyes ache from the grainy footage, but you start to see the patterns—the way their big man cheats on the pick-and-roll.
# ACTION: updateAttribute | bbiq | 1
-> coach_done

=== extra_sprints ===
Lungs burning, legs screaming. You drill the baseline suicides until the floor is slick with sweat. You're exhausted, but your engine feels bigger.
# ACTION: updateAttribute | athleticism | 1
-> coach_done

=== coach_done ===
Coach claps your shoulder. "Good work. Keep that fire, and you might actually make it out of this town."
# SCENE_COMPLETE
-> END
