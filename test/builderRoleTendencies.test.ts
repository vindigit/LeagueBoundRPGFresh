import { ARCHETYPE_PROFILES_BY_POSITION, type ArchetypeProfile } from "../src/builder/presets";
import { derivePlayerRoleTendencies, type PlayerRoleTendencies } from "../src/builder/roleTendencies";
import { LeagueLevel } from "../src/types/career";
import type { PlayerAttributes, Position } from "../src/types/player";

const getProfile = (position: Position, id: ArchetypeProfile["id"]): ArchetypeProfile => {
  const profile = ARCHETYPE_PROFILES_BY_POSITION[position].find((candidate) => candidate.id === id);
  if (!profile) {
    throw new Error(`Missing profile ${position} ${id}`);
  }
  return profile;
};

const derive = (profile: ArchetypeProfile, attributes: PlayerAttributes = profile.attributes): PlayerRoleTendencies =>
  derivePlayerRoleTendencies({
    attributes,
    position: profile.position,
    archetypeProfile: profile,
    height: profile.position === "C" ? { feet: 6, inches: 11 } : profile.position === "PF" ? { feet: 6, inches: 8 } : { feet: 6, inches: 4 },
    weightLbs: profile.position === "C" ? 245 : profile.position === "PF" ? 220 : 195,
    leagueLevel: LeagueLevel.MIDDLE_SCHOOL,
  });

const values = (tendencies: PlayerRoleTendencies): number[] => Object.values(tendencies);

describe("builder role tendencies", () => {
  it("gives PG playmakers more touch and pass creation than SG movement shooters", () => {
    const playmaker = derive(getProfile("PG", "pg_primary_creator"));
    const shooter = derive(getProfile("SG", "sg_movement_shooter"));

    expect(playmaker.touchWeight).toBeGreaterThan(shooter.touchWeight);
    expect(playmaker.passCreationWeight).toBeGreaterThan(shooter.passCreationWeight);
  });

  it("keeps SG slashers above movement shooters in rim pressure", () => {
    const slasher = derive(getProfile("SG", "sg_slashing_scorer"));
    const shooter = derive(getProfile("SG", "sg_movement_shooter"));

    expect(slasher.rimPressureWeight).toBeGreaterThan(shooter.rimPressureWeight);
  });

  it("lets edited slasher attributes shift toward shooting", () => {
    const slasher = getProfile("SG", "sg_slashing_scorer");
    const preset = derive(slasher);
    const edited = derive(slasher, {
      ...slasher.attributes,
      shortRange: 48,
      dunking: 42,
      midrange: 88,
      threePoint: 90,
    });

    expect(edited.threeVolumeWeight).toBeGreaterThan(preset.threeVolumeWeight);
    expect(edited.midrangeVolumeWeight).toBeGreaterThan(preset.midrangeVolumeWeight);
    expect(edited.rimPressureWeight).toBeLessThan(preset.rimPressureWeight);
  });

  it("keeps rim protectors defensive without high offensive usage", () => {
    const rimProtector = derive(getProfile("C", "c_rim_protector"));
    const stretchBig = derive(getProfile("C", "c_stretch_big"));

    expect(rimProtector.blockEventWeight).toBeGreaterThan(stretchBig.blockEventWeight);
    expect(rimProtector.contestWeight).toBeGreaterThan(stretchBig.contestWeight);
    expect(rimProtector.touchWeight).toBeLessThan(stretchBig.touchWeight);
  });

  it("keeps stretch bigs above other centers in three volume", () => {
    const stretchBig = derive(getProfile("C", "c_stretch_big"));
    const paint = derive(getProfile("C", "c_paint_beast"));
    const rimProtector = derive(getProfile("C", "c_rim_protector"));

    expect(stretchBig.threeVolumeWeight).toBeGreaterThan(paint.threeVolumeWeight);
    expect(stretchBig.threeVolumeWeight).toBeGreaterThan(rimProtector.threeVolumeWeight);
    expect(stretchBig.selfCreationWeight).toBeLessThan(0.55);
  });

  it("clamps every final tendency value from 0 to 1", () => {
    for (const positionProfiles of Object.values(ARCHETYPE_PROFILES_BY_POSITION)) {
      for (const profile of positionProfiles) {
        for (const value of values(derive(profile))) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});
