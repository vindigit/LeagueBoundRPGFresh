import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { formatSchoolPathLabel, getSchoolPathProfile } from "../constants/schoolPaths";
import { NarrativeOverlay } from "../components/NarrativeOverlay";
import { PlayerCard } from "../components/PlayerCard";
import { BackstoryScreen } from "../features/backstory/screens/BackstoryScreen";
import { HIGH_SCHOOL_RECRUITING_PROGRAMS } from "../features/career/recruiting";
import { SchoolPathSelectionScreen } from "../features/career/screens/SchoolPathSelectionScreen";
import { MatchScreen } from "../features/match/screens/MatchScreen";
import { PostgameScreen } from "../features/match/screens/PostgameScreen";
import { useCareerStore } from "../store/useCareerStore";
import { LeagueLevel } from "../types/career";
import type { ProjectedRole } from "../types/careerProgression";

const formatLeagueLevel = (value: string): string =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

const formatGpa = (value: number): string => value.toFixed(1);
const formatInjuryPenalty = (multiplier: number): string => `-${Math.round((1 - multiplier) * 100)}% performance`;
const formatWeeksRemaining = (weeksRemaining: number): string => `${weeksRemaining} ${weeksRemaining === 1 ? "week" : "weeks"} left`;

const projectedRoleLabel: Record<ProjectedRole, string> = {
  BENCH: "Bench role",
  ROTATION: "Rotation role",
  SIXTH_MAN: "Sixth man role",
  STARTER: "Starter role",
  STAR: "Star role",
};

const getInterestStrengthLabel = (interestLevel: number): string => {
  if (interestLevel >= 88) {
    return "Locked In";
  }
  if (interestLevel >= 78) {
    return "Hot";
  }
  if (interestLevel >= 68) {
    return "Strong";
  }
  return "Warm";
};

export function HomeScreen() {
  const view = useCareerStore((state) => state.view);
  const leagueLevel = useCareerStore((state) => state.leagueLevel);
  const currentYear = useCareerStore((state) => state.currentYear);
  const currentWeek = useCareerStore((state) => state.currentWeek);
  const bankBalance = useCareerStore((state) => state.player.bankBalance);
  const scoutVisibility = useCareerStore((state) => state.scoutVisibility);
  const gpa = useCareerStore((state) => state.gpa);
  const schoolPath = useCareerStore((state) => state.schoolPath);
  const injury = useCareerStore((state) => state.injury);
  const wearTear = useCareerStore((state) => state.wearTear);
  const teamInterestById = useCareerStore((state) => state.teamInterestById);
  const offers = useCareerStore((state) => state.offers);
  const newsFeed = useCareerStore((state) => state.newsFeed);
  const weeklyLoop = useCareerStore((state) => state.weeklyLoop);
  const startNarrative = useCareerStore((state) => state.startNarrative);
  const completeStudyActivity = useCareerStore((state) => state.completeStudyActivity);
  const navigateToMatch = useCareerStore((state) => state.navigateToMatch);
  const respondToOffer = useCareerStore((state) => state.respondToOffer);
  const showSchoolPathStatus = leagueLevel !== LeagueLevel.MIDDLE_SCHOOL;
  const schoolPathProfile = showSchoolPathStatus ? getSchoolPathProfile(schoolPath) : null;
  const academicallyEligible = leagueLevel === LeagueLevel.PRO || gpa >= 2;
  const visibleInterestEntries = Object.entries(teamInterestById)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4);
  const availableOffers = offers.filter((offer) => offer.status === "AVAILABLE" && offer.phases.includes("HIGH_SCHOOL"));
  const acceptedOffer = offers.find((offer) => offer.status === "ACCEPTED" && offer.phases.includes("HIGH_SCHOOL"));
  const canOpenEvent = !weeklyLoop.eventCompleted && !weeklyLoop.postgamePending;
  const canStudy = !weeklyLoop.studyCompleted && !weeklyLoop.matchCompleted && !weeklyLoop.postgamePending;
  const canPlayMatch = weeklyLoop.eventCompleted && !weeklyLoop.matchCompleted && !weeklyLoop.postgamePending && academicallyEligible;
  const isBlockedByGpa = weeklyLoop.eventCompleted && !weeklyLoop.matchCompleted && !weeklyLoop.postgamePending && !academicallyEligible;
  const loopStatus = weeklyLoop.postgamePending
    ? "Finish postgame to resolve the week."
    : weeklyLoop.matchCompleted
      ? "Week complete. Advance from postgame."
      : isBlockedByGpa
        ? "Event complete. Raise GPA to 2.0 to unlock the match."
      : weeklyLoop.eventCompleted
        ? "Event complete. Match is unlocked."
        : "Start your weekly event to unlock the match.";

  return (
    <SafeAreaView className="relative flex-1 bg-premium-bg">
      {view === "HUB" ? (
        <ScrollView contentContainerClassName="px-4 pb-8 pt-6">
          <Text className="text-xs font-semibold uppercase tracking-widest text-premium-accent">Career Hub</Text>
          <Text className="mt-1 text-3xl font-bold text-white">Between Games</Text>

          <View className="mt-5">
            <PlayerCard />
          </View>

          <View className="mt-5 rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-4">
            <Text className="text-xs font-semibold uppercase tracking-wider text-premium-muted">Hometown Feed</Text>
            {newsFeed.length > 0 ? (
              <View className="mt-3 gap-2">
                {newsFeed.slice(0, 4).map((item) => (
                  <View key={item.id} className="rounded-lg bg-premium-bg px-3 py-2">
                    <Text className="text-sm font-semibold text-white">{item.headline}</Text>
                    {item.subhead ? <Text className="mt-1 text-xs text-premium-muted">{item.subhead}</Text> : null}
                  </View>
                ))}
              </View>
            ) : (
              <Text className="mt-3 text-sm text-premium-muted">Local coverage will appear after your first game.</Text>
            )}
          </View>

          <View className="mt-5 rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-4">
            <Text className="text-xs font-semibold uppercase tracking-wider text-premium-muted">Status</Text>

            <View className="mt-3 flex-row flex-wrap gap-3">
              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">League</Text>
                <Text className="mt-1 text-base font-semibold text-white">{formatLeagueLevel(leagueLevel)}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">Year</Text>
                <Text className="mt-1 text-base font-semibold text-white">{currentYear}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">Week</Text>
                <Text className="mt-1 text-base font-semibold text-white">{currentWeek}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">Bank</Text>
                <Text className="mt-1 text-base font-semibold text-premium-accent">{formatCurrency(bankBalance)}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">Exposure</Text>
                <Text className="mt-1 text-base font-semibold text-white">{scoutVisibility}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">GPA</Text>
                <Text className={`mt-1 text-base font-semibold ${academicallyEligible ? "text-white" : "text-amber-300"}`}>
                  {formatGpa(gpa)}
                </Text>
              </View>

              {showSchoolPathStatus ? (
                <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                  <Text className="text-xs text-premium-muted">School Path</Text>
                  <Text className="mt-1 text-base font-semibold text-white">{formatSchoolPathLabel(schoolPath)}</Text>
                  {schoolPathProfile ? (
                    <Text className="mt-1 text-xs text-premium-muted">{schoolPathProfile.playingTimeLabel}</Text>
                  ) : null}
                </View>
              ) : null}
            </View>

            <View className="mt-3 rounded-lg bg-premium-bg p-3">
              <Text className="text-xs text-premium-muted">Loop Status</Text>
              <Text className="mt-1 text-sm font-medium text-white">{loopStatus}</Text>
            </View>

            <View className="mt-3 rounded-lg bg-premium-bg p-3">
              <Text className="text-xs text-premium-muted">Health</Text>
              {injury ? (
                <>
                  <Text className="mt-1 text-sm font-semibold text-amber-200">Minor ankle sprain</Text>
                  <Text className="mt-1 text-xs text-premium-muted">
                    {formatWeeksRemaining(injury.weeksRemaining)} | {formatInjuryPenalty(injury.performanceMultiplier)}
                  </Text>
                </>
              ) : (
                <Text className="mt-1 text-sm font-medium text-white">Healthy</Text>
              )}
              <Text className="mt-2 text-xs text-premium-muted">Wear & Tear: {wearTear}</Text>
            </View>
          </View>

          {leagueLevel === LeagueLevel.HIGH_SCHOOL ? (
            <View className="mt-5 rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-4">
              <Text className="text-xs font-semibold uppercase tracking-wider text-premium-muted">Recruiting Interest</Text>
              {visibleInterestEntries.length > 0 ? (
                <View className="mt-3 gap-3">
                  {visibleInterestEntries.map(([teamId, interest]) => {
                    const label =
                      availableOffers.find((offer) => offer.sourceTeamId === teamId)?.sourceLabel ??
                      HIGH_SCHOOL_RECRUITING_PROGRAMS.find((program) => program.id === teamId)?.label ??
                      teamId;
                    return (
                      <View key={teamId} className="rounded-lg bg-premium-bg p-3">
                        <View className="flex-row items-center justify-between">
                          <Text className="text-sm font-semibold text-white">{label}</Text>
                          <Text className="text-sm font-semibold text-premium-accent">{interest}</Text>
                        </View>
                        <View className="mt-2 h-2 rounded-full bg-premium-surfaceAlt">
                          <View className="h-2 rounded-full bg-emerald-400" style={{ width: `${interest}%` }} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Text className="mt-3 text-sm text-premium-muted">Recruiting buzz will build once your high school run begins.</Text>
              )}
            </View>
          ) : null}

          {leagueLevel === LeagueLevel.HIGH_SCHOOL ? (
            <View className="mt-5 rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-4">
              <Text className="text-xs font-semibold uppercase tracking-wider text-premium-muted">Offer Inbox</Text>
              {acceptedOffer ? (
                <View className="mt-3 rounded-lg bg-premium-bg p-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-white">{acceptedOffer.sourceLabel}</Text>
                    <Text className="text-xs font-semibold uppercase text-emerald-300">{acceptedOffer.type}</Text>
                  </View>
                  <Text className="mt-1 text-xs text-premium-muted">Committed offer</Text>
                  <Text className="mt-2 text-sm text-white">{projectedRoleLabel[acceptedOffer.projectedRole]}</Text>
                  <Text className="mt-1 text-xs text-premium-muted">
                    {getInterestStrengthLabel(acceptedOffer.interestLevel)} interest | {acceptedOffer.exposureTier} exposure
                  </Text>
                  {acceptedOffer.scholarshipPercent !== undefined ? (
                    <Text className="mt-1 text-xs text-premium-muted">Scholarship: {acceptedOffer.scholarshipPercent}%</Text>
                  ) : null}
                </View>
              ) : availableOffers.length > 0 ? (
                <View className="mt-3 gap-3">
                  {availableOffers.map((offer) => (
                    <View key={offer.id} className="rounded-lg bg-premium-bg p-3">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-semibold text-white">{offer.sourceLabel}</Text>
                        <Text className="text-xs font-semibold uppercase text-emerald-300">{offer.type}</Text>
                      </View>
                      <Text className="mt-2 text-sm text-white">{projectedRoleLabel[offer.projectedRole]}</Text>
                      <Text className="mt-1 text-xs text-premium-muted">
                        {getInterestStrengthLabel(offer.interestLevel)} interest | {offer.exposureTier} exposure
                      </Text>
                      {offer.scholarshipPercent !== undefined ? (
                        <Text className="mt-1 text-xs text-premium-muted">Scholarship: {offer.scholarshipPercent}%</Text>
                      ) : null}
                      <View className="mt-3 flex-row gap-2">
                        <Pressable
                          className="flex-1 items-center rounded-lg bg-emerald-600 px-3 py-2"
                          onPress={() => {
                            respondToOffer(offer.id, "ACCEPT");
                          }}
                        >
                          <Text className="text-sm font-semibold text-white">Accept</Text>
                        </Pressable>
                        <Pressable
                          className="flex-1 items-center rounded-lg bg-slate-700 px-3 py-2"
                          onPress={() => {
                            respondToOffer(offer.id, "DECLINE");
                          }}
                        >
                          <Text className="text-sm font-semibold text-white">Decline</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="mt-3 text-sm text-premium-muted">No offers yet. Strong weeks will move the meters.</Text>
              )}
            </View>
          ) : null}

          <Pressable
            className={`mt-6 items-center justify-center rounded-xl px-4 py-4 ${canPlayMatch ? "bg-sky-600" : "bg-slate-700"}`}
            disabled={!canPlayMatch}
            onPress={navigateToMatch}
          >
            <Text className="text-base font-semibold text-white">Play Match</Text>
          </Pressable>

          {isBlockedByGpa ? (
            <Text className="mt-3 text-sm font-medium text-amber-300">Academically ineligible: raise GPA to 2.0 to play.</Text>
          ) : null}

          <Pressable
            className={`mt-3 items-center justify-center rounded-xl px-4 py-4 ${canStudy ? "bg-emerald-600" : "bg-slate-700"}`}
            disabled={!canStudy}
            onPress={completeStudyActivity}
          >
            <Text className="text-base font-semibold text-white">{weeklyLoop.studyCompleted ? "Study Complete" : "Study"}</Text>
          </Pressable>

          <Pressable
            className={`mt-3 items-center justify-center rounded-xl px-4 py-4 ${canOpenEvent ? "bg-premium-accent" : "bg-slate-700"}`}
            disabled={!canOpenEvent}
            onPress={() => {
              startNarrative("practice_coach.ink");
            }}
          >
            <Text className={`text-base font-semibold ${canOpenEvent ? "text-black" : "text-slate-200"}`}>Next Event</Text>
          </Pressable>
        </ScrollView>
      ) : null}

      {view === "NARRATIVE" ? <NarrativeOverlay /> : null}

      {view === "MATCH" ? <MatchScreen /> : null}

      {view === "POSTGAME" ? <PostgameScreen /> : null}

      {view === "BACKSTORY" ? <BackstoryScreen /> : null}

      {view === "SCHOOL_PATH_SELECT" ? <SchoolPathSelectionScreen /> : null}
    </SafeAreaView>
  );
}
