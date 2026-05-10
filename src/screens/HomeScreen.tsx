import { Modal, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { formatSchoolPathLabel, getSchoolPathProfile } from "../constants/schoolPaths";
import { NarrativeOverlay } from "../components/NarrativeOverlay";
import { PlayerCard } from "../components/PlayerCard";
import { BackstoryScreen } from "../features/backstory/screens/BackstoryScreen";
import { HIGH_SCHOOL_RECRUITING_PROGRAMS } from "../features/career/recruiting";
import { SchoolPathSelectionScreen } from "../features/career/screens/SchoolPathSelectionScreen";
import { getWeeklyActionDefinition } from "../features/career/weeklyActions";
import { MatchScreen } from "../features/match/screens/MatchScreen";
import { PostgameScreen } from "../features/match/screens/PostgameScreen";
import { useCareerStore } from "../store/useCareerStore";
import { LeagueLevel, type WeeklyActionDefinitionId, type WeeklyActionResult } from "../types/career";
import type { FinanceLedgerEntry, ProjectedRole } from "../types/careerProgression";

const formatLeagueLevel = (value: string): string =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

const formatFinanceAmount = (entry: FinanceLedgerEntry): string =>
  `${entry.type === "income" ? "+" : "-"}${formatCurrency(entry.amount)}`;

const formatFinanceCategory = (category: string): string =>
  category
    .split("_")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");

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

const formatActionPreview = (actionId: WeeklyActionDefinitionId, leagueLevel: LeagueLevel): string => {
  const entry = getWeeklyActionDefinition(actionId).buildEntry({ leagueLevel });
  const parts = [
    entry.energyDelta !== 0 ? `Energy ${entry.energyDelta > 0 ? "+" : ""}${entry.energyDelta}` : null,
    entry.conditionDelta !== 0 ? `Condition ${entry.conditionDelta > 0 ? "+" : ""}${entry.conditionDelta}` : null,
    entry.gpaDelta ? `GPA +${entry.gpaDelta.toFixed(1)}` : null,
    entry.coachTrustDelta ? `Trust +${entry.coachTrustDelta}` : null,
    entry.fansDelta ? `Fans +${entry.fansDelta}` : null,
    entry.teammatesDelta ? `Team +${entry.teammatesDelta}` : null,
    entry.moneyDelta ? `$${Math.abs(entry.moneyDelta)}` : null,
  ].filter(Boolean);

  return parts.join(" | ");
};

const formatWeeklyActionResultLines = (result: WeeklyActionResult): string[] =>
  [
    result.energyDelta !== 0 ? `Energy ${result.energyDelta > 0 ? "+" : ""}${result.energyDelta}` : null,
    result.conditionDelta !== 0 ? `Condition ${result.conditionDelta > 0 ? "+" : ""}${result.conditionDelta}` : null,
    result.gpaDelta ? `GPA +${result.gpaDelta.toFixed(1)}` : null,
    result.coachTrustDelta ? `Coach Trust +${result.coachTrustDelta}` : null,
    result.fansDelta ? `Fans +${result.fansDelta}` : null,
    result.teammatesDelta ? `Teammates +${result.teammatesDelta}` : null,
    result.scoutVisibilityDelta ? `Exposure +${result.scoutVisibilityDelta}` : null,
    result.moneyDelta ? `Cost $${Math.abs(result.moneyDelta)}` : null,
  ].filter((value): value is string => Boolean(value));

export function HomeScreen() {
  const view = useCareerStore((state) => state.view);
  const leagueLevel = useCareerStore((state) => state.leagueLevel);
  const currentYear = useCareerStore((state) => state.currentYear);
  const currentWeek = useCareerStore((state) => state.currentWeek);
  const bankBalance = useCareerStore((state) => state.player.bankBalance);
  const financeLedger = useCareerStore((state) => state.financeLedger);
  const scoutVisibility = useCareerStore((state) => state.scoutVisibility);
  const coachTrust = useCareerStore((state) => state.coachTrust);
  const fans = useCareerStore((state) => state.fans);
  const teammates = useCareerStore((state) => state.teammates);
  const energy = useCareerStore((state) => state.energy);
  const condition = useCareerStore((state) => state.condition);
  const gpa = useCareerStore((state) => state.gpa);
  const schoolPath = useCareerStore((state) => state.schoolPath);
  const injury = useCareerStore((state) => state.injury);
  const wearTear = useCareerStore((state) => state.wearTear);
  const teamInterestById = useCareerStore((state) => state.teamInterestById);
  const offers = useCareerStore((state) => state.offers);
  const newsFeed = useCareerStore((state) => state.newsFeed);
  const weeklyActionState = useCareerStore((state) => state.weeklyActionState);
  const lastWeeklyActionResult = useCareerStore((state) => state.lastWeeklyActionResult);
  const takeWeeklyAction = useCareerStore((state) => state.takeWeeklyAction);
  const dismissWeeklyActionResult = useCareerStore((state) => state.dismissWeeklyActionResult);
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
  const recentFinanceEntries = financeLedger.slice(-3).reverse();
  const canPlayMatch = weeklyActionState.matchUnlocked && !weeklyActionState.postgamePending && academicallyEligible;
  const isBlockedByGpa = weeklyActionState.matchUnlocked && !weeklyActionState.postgamePending && !academicallyEligible;
  const loopStatus = weeklyActionState.postgamePending
    ? "Finish postgame to resolve the week."
    : isBlockedByGpa
      ? "Action plan complete. Raise GPA to 2.0 to unlock the match."
      : weeklyActionState.matchUnlocked
        ? "Action plan complete. Match unlocked."
        : `${weeklyActionState.slotsRemaining} of ${weeklyActionState.slotsTotal} weekly actions remaining.`;
  const visibleActionIds = weeklyActionState.availableActionIds.filter((actionId) =>
    weeklyActionState.optionalNarrativeActionId === actionId ||
    !weeklyActionState.actionsTaken.some((action) => action.id === actionId),
  );
  const recruitingBuzz = visibleInterestEntries[0]?.[1] ?? 0;

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
                <Text className="text-xs text-premium-muted">Energy</Text>
                <Text className="mt-1 text-base font-semibold text-white">{energy}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">Condition</Text>
                <Text className="mt-1 text-base font-semibold text-white">{condition}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">Coach Trust</Text>
                <Text className="mt-1 text-base font-semibold text-white">{coachTrust}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">Fans</Text>
                <Text className="mt-1 text-base font-semibold text-white">{fans}</Text>
              </View>

              <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                <Text className="text-xs text-premium-muted">Teammates</Text>
                <Text className="mt-1 text-base font-semibold text-white">{teammates}</Text>
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

              {leagueLevel === LeagueLevel.HIGH_SCHOOL ? (
                <View className="min-w-[30%] flex-1 rounded-lg bg-premium-bg p-3">
                  <Text className="text-xs text-premium-muted">Recruiting Buzz</Text>
                  <Text className="mt-1 text-base font-semibold text-white">{recruitingBuzz}</Text>
                </View>
              ) : null}
            </View>

            <View className="mt-3 rounded-lg bg-premium-bg p-3">
              <Text className="text-xs text-premium-muted">Loop Status</Text>
              <Text className="mt-1 text-sm font-medium text-white">{loopStatus}</Text>
            </View>

            <View className="mt-3 rounded-lg bg-premium-bg p-3">
              <Text className="text-xs text-premium-muted">Weekly Action Budget</Text>
              <Text className="mt-1 text-sm font-medium text-white">
                {weeklyActionState.slotsRemaining} remaining out of {weeklyActionState.slotsTotal}
              </Text>
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

          <View className="mt-5 rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-4">
            <Text className="text-xs font-semibold uppercase tracking-wider text-premium-muted">Recent Financial Activity</Text>
            {recentFinanceEntries.length > 0 ? (
              <View className="mt-3 gap-3">
                {recentFinanceEntries.map((entry) => (
                  <View key={entry.id} className="rounded-lg bg-premium-bg p-3">
                    <View className="flex-row items-start justify-between gap-3">
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-white">{entry.description}</Text>
                        <Text className="mt-1 text-xs text-premium-muted">
                          Week {entry.week} | {formatFinanceCategory(entry.category)} | {entry.source}
                        </Text>
                      </View>
                      <Text className={`text-sm font-semibold ${entry.type === "income" ? "text-emerald-300" : "text-red-300"}`}>
                        {formatFinanceAmount(entry)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="mt-3 text-sm text-premium-muted">Financial activity will appear after your first payout or expense.</Text>
            )}
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

          <View className="mt-5 rounded-2xl border border-premium-surfaceAlt bg-premium-surface p-4">
            <Text className="text-xs font-semibold uppercase tracking-wider text-premium-muted">Weekly Actions</Text>
            <Text className="mt-2 text-sm text-premium-muted">
              Spend your remaining actions to prepare for the week. The match unlocks once the budget is exhausted.
            </Text>

            <View className="mt-4 gap-3">
              {visibleActionIds.map((actionId) => {
                const definition = getWeeklyActionDefinition(actionId);
                const isTaken = weeklyActionState.actionsTaken.some((action) => action.id === actionId);
                const entry = definition.buildEntry({ leagueLevel });
                const needsMoney = (entry.moneyDelta ?? 0) < 0 && bankBalance < Math.abs(entry.moneyDelta ?? 0);
                const disabled =
                  isTaken ||
                  weeklyActionState.postgamePending ||
                  weeklyActionState.matchUnlocked ||
                  weeklyActionState.slotsRemaining <= 0 ||
                  needsMoney;

                return (
                  <Pressable
                    key={actionId}
                    className={`rounded-xl border px-4 py-4 ${
                      disabled ? "border-slate-700 bg-slate-800/70" : "border-premium-surfaceAlt bg-premium-bg"
                    }`}
                    disabled={disabled}
                    onPress={() => {
                      takeWeeklyAction(actionId);
                    }}
                  >
                    <View className="flex-row items-center justify-between gap-3">
                      <Text className={`flex-1 text-base font-semibold ${disabled ? "text-slate-300" : "text-white"}`}>
                        {definition.label}
                      </Text>
                      {weeklyActionState.optionalNarrativeActionId === actionId ? (
                        <Text className="text-xs font-semibold uppercase text-premium-accent">Scene</Text>
                      ) : null}
                    </View>
                    <Text className="mt-1 text-sm text-premium-muted">{definition.description}</Text>
                    <Text className="mt-2 text-xs text-premium-muted">{formatActionPreview(actionId, leagueLevel)}</Text>
                    {needsMoney ? <Text className="mt-2 text-xs font-semibold text-amber-300">Need $25</Text> : null}
                  </Pressable>
                );
              })}
            </View>
          </View>

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
        </ScrollView>
      ) : null}

      {view === "NARRATIVE" ? <NarrativeOverlay /> : null}

      {view === "MATCH" ? <MatchScreen /> : null}

      {view === "POSTGAME" ? <PostgameScreen /> : null}

      {view === "BACKSTORY" ? <BackstoryScreen /> : null}

      {view === "SCHOOL_PATH_SELECT" ? <SchoolPathSelectionScreen /> : null}

      {view === "HUB" && lastWeeklyActionResult ? (
        <Modal transparent visible animationType="fade" statusBarTranslucent>
          <View className="flex-1 items-center justify-center bg-black/70 px-6">
            <View className="w-full max-w-md rounded-3xl border border-premium-surfaceAlt bg-premium-surface p-6">
              <Text className="text-xs font-semibold uppercase tracking-[0.24em] text-premium-accent">
                {lastWeeklyActionResult.actionLabel}
              </Text>
              <Text className="mt-3 text-2xl font-bold text-white">{lastWeeklyActionResult.title}</Text>
              {lastWeeklyActionResult.tagline ? (
                <Text className="mt-2 text-sm font-semibold text-premium-accent">{lastWeeklyActionResult.tagline}</Text>
              ) : null}
              {lastWeeklyActionResult.description ? (
                <Text className="mt-3 text-sm leading-6 text-premium-muted">{lastWeeklyActionResult.description}</Text>
              ) : null}
              <View className="mt-5 gap-2 rounded-2xl bg-premium-bg p-4">
                {formatWeeklyActionResultLines(lastWeeklyActionResult).map((line) => (
                  <Text key={line} className="text-sm font-medium text-white">
                    {line}
                  </Text>
                ))}
              </View>
              <Pressable
                className="mt-5 items-center rounded-xl bg-sky-600 px-4 py-3"
                onPress={dismissWeeklyActionResult}
              >
                <Text className="text-base font-semibold text-white">Continue</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}
