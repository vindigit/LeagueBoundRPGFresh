import { LeagueLevel } from "../../types/career";

export const GYM_BAG_GOODS_TITLE = "Gym Bag Goods";
export const GYM_BAG_GOODS_ENTRY_COPY = "Open Gym Bag Goods";
export const GYM_BAG_GOODS_SLOGAN = "Everything you forgot. Everything you need.";
export const GYM_BAG_GOODS_CORE_DESCRIPTION =
  "A player-supply counter stocked with the little things that keep a hoop dream moving.";
export const GYM_BAG_GOODS_PURCHASE_SUCCESS_COPY = "Added to your gym bag.";
export const GYM_BAG_GOODS_INSUFFICIENT_FUNDS_COPY = "You check your pockets. Not enough cash.";
export const GYM_BAG_GOODS_EMPTY_COPY = "More items unlock as your career grows.";

export const getGymBagGoodsDisplayName = (leagueLevel: LeagueLevel): string => {
  switch (leagueLevel) {
    case LeagueLevel.HIGH_SCHOOL:
      return "Gym Bag Goods — Team Store";
    case LeagueLevel.COLLEGE:
      return "Gym Bag Goods — Campus Supply";
    case LeagueLevel.PRO:
      return "Gym Bag Goods — Arena Tunnel";
    case LeagueLevel.MIDDLE_SCHOOL:
    default:
      return "Gym Bag Goods — Rec Counter";
  }
};

export const getGymBagGoodsDescription = (leagueLevel: LeagueLevel): string => {
  switch (leagueLevel) {
    case LeagueLevel.HIGH_SCHOOL:
      return "The Team Store carries everyday player essentials: fuel, recovery items, practice gear, and small upgrades for players trying to earn minutes.";
    case LeagueLevel.COLLEGE:
      return "Campus Supply stocks performance drinks, recovery gear, NIL products, and athlete-approved essentials for the college grind.";
    case LeagueLevel.PRO:
      return "Arena Tunnel carries premium fuel, recovery tech, signature gear, and sponsor-backed products used by players under the brightest lights.";
    case LeagueLevel.MIDDLE_SCHOOL:
    default:
      return "The Rec Counter has the basics: drinks, snacks, tape, and cheap gear for players trying to survive another long tournament day.";
  }
};
