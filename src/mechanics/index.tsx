import type { ComponentType } from 'react';
import type { MechanicProps } from '../ui';
import { RevealCards, TapReveal } from './reveal';
import { Sequence } from './sequence';
import { ChoiceMechanic } from './choice';
import {
  CharacterInteraction,
  CollectItems,
  HiddenObject,
  MovingTargetAim,
  ReactiveTap,
  ResourceTap,
  SceneExploration,
} from './explore';
import {
  CombineTwo,
  FinalBuild,
  InventorySort,
  LinkChain,
  PairedQuiz,
  RoutePuzzle,
  SpotTheBug,
  StabilityGauge,
  TimingWindow,
} from './skill';

/** mechanic.type (GAME_SPEC_V2.json) -> reusable component. */
export const MECHANICS: Record<string, ComponentType<MechanicProps>> = {
  rapidTapProgressiveReveal: TapReveal,
  independentRevealCards: RevealCards,
  orderedSequence: Sequence,
  pipeline: Sequence,
  alternatingCoop: Sequence,
  layerBuilder: Sequence,
  spatialChoice: ChoiceMechanic,
  routeChoice: ChoiceMechanic,
  choice: ChoiceMechanic,
  choiceWithEscalation: ChoiceMechanic,
  inspectThenEquip: ChoiceMechanic,
  hiddenObject: HiddenObject,
  movingTargetAim: MovingTargetAim,
  resourceTap: ResourceTap,
  collectRequiredPlusOptional: CollectItems,
  timingWindow: TimingWindow,
  stabilityGauge: StabilityGauge,
  inventorySort: InventorySort,
  linkChain: LinkChain,
  spotTheBug: SpotTheBug,
  pairedQuiz: PairedQuiz,
  characterInteraction: CharacterInteraction,
  sceneExploration: SceneExploration,
  reactiveTap: ReactiveTap,
  multiStepRoutePuzzle: RoutePuzzle,
  combineAnyTwo: CombineTwo,
  finalBuildAssembly: FinalBuild,
};
