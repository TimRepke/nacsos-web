import { createVNode, render, RendererElement, RendererNode } from "vue";
import type { Component, App, VNode } from "vue";

export type MountResult = {
  vNode: VNode;
  el: HTMLElement;
  destroy: () => void;
};

export function mount<TProps>(
  component: Component,
  {
    props,
    children,
    element,
    app,
  }: {
    props?: TProps;
    children?: unknown;
    app?: App;
    element?: HTMLElement;
  } = {},
): MountResult {
  let el = element;

  let vNode:
    | VNode<
        RendererNode,
        RendererElement,
        {
          [key: string]: any;
        }
      >
    | undefined = createVNode(component, props ?? null, children);
  if (app && app._context) vNode.appContext = app._context;
  if (el) render(vNode, el);
  else if (typeof document !== "undefined") render(vNode, (el = document.createElement("div")));

  const destroy = () => {
    if (el) render(null, el);
    el = undefined;
    vNode = undefined;
  };

  if (!el) throw ReferenceError("Element is not defined");

  return { vNode, destroy, el };
}
