import { RankLanes } from "./RankLanes";
import { BranchTree } from "./BranchTree";
export const experiments = [
  { id: "ranks", name: "Branch spans", description: "Bands span their actual descendants. Each card shows its source rank; rows show parent–child depth.", Component: RankLanes },
  { id: "tree", name: "Branch paths", description: "Compare direct parent–child paths. Shared ancestors repeat across columns.", Component: BranchTree },
] as const;
