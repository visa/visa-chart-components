/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

export const prepareRenderChange = ({
  selection,
  duration,
  namespace,
  easing,
  delay
}: {
  selection: any;
  duration: any;
  namespace?: string;
  easing?: any;
  delay?: any;
}) => {
  // we do not want to use javascript's animation engine if the change should be immediate
  if (!duration) {
    return selection;
  }

  // every transition must have a namespace
  const transitionNamespace = namespace || 'generic-transition';

  // interrupt any existing transitions of that namespace and stop any queued
  selection.interrupt(transitionNamespace);

  // set up initial transition
  let transitionChain = selection.transition(transitionNamespace).duration(duration);

  // for transitions with an easing, we modify the object chain to include it
  if (easing) {
    transitionChain = transitionChain.ease(easing);
  }

  // for transitions with a delay, we modify the object chain to include it
  if (delay) {
    transitionChain = transitionChain.delay(delay);
  }

  // we return the new selection
  return transitionChain;
};
