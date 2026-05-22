import type { Household } from "@/lib/types";
import { members } from "@/lib/mock/members";

export { members };

export const household: Household = {
  id: "h1",
  name: "Casa Rivero",
  currency: "ARS",
  members,
  monthlyIncomeTarget: 1850000,
};
