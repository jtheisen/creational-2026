import type { Taxon, branchWindow } from "../domain/taxonomy";
export interface ViewProps {
  focus: Taxon;
  window: ReturnType<typeof branchWindow>;
  depth: number;
  onNavigate: (id: string) => void;
}
