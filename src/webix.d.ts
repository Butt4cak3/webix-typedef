declare namespace webix {
  function ui<T extends ViewConfig>(config: Partial<T>, parent?: ui.baseview | string, replacement?: ui.baseview | string | number): ViewMap[T["view"]];

  interface BaseBind {
    bind(target: ui.baseview, rule: (slave: ui.baseview, master: ui.baseview) => boolean, format: string): void;
  }

  interface Destruction {
    destructor(): void;
  }

  interface EventSystem<E extends events.EventList> {
    attachEvent<K extends keyof E>(type: K, functor: E[K], id: string): string;
    blockEvent(): void;
    callEvent(name: keyof E, params: any[]): boolean;
    detachEvent(id: string): void;
    hasEvent(name: string): boolean;
    mapEvent(map: Partial<E>): void;
    unblockEvent(): void;
  }

  interface ScrollState {
    x: number;
    y: number;
  }

  interface Scrollable {
    getScrollState(): ScrollState;
    scrollTo(x: number, y: number): void;
  }

  interface Settings {
    config: {};
    define<K extends keyof this["config"]>(property: K, value: this["config"][K]): void;
    id: string;
    readonly name: string;
  }

  interface ViewConfig {
    view: keyof ViewMap;
  }

  interface ViewMap {
    "form": ui.form;
    "layout": ui.layout;
  }

  // TODO: What does LayoutState look like?
  interface LayoutState {}

  namespace events {
    interface EventList {}

    interface Scrollable extends EventList {
      onAfterScroll: () => void;
    }

    interface baseview extends EventList {
      onBindRequest: () => void;
      onDestruct: () => void;
    }

    interface baselayout extends baseview {}

    interface layout extends baselayout, Scrollable {}
  }

  namespace config {
    type EventSystem<E extends events.EventList> = {
      on: Partial<E>;
    };

    type baseview = ViewConfig & {
      animate: boolean;
      borderless: boolean;
      container: HTMLElement | string;
      css: string;
      disabled: boolean;
      gravity: number;
      height: number;
      hidden: boolean;
      id: string;
      maxHeight: number;
      maxWidth: number;
      minHeight: number;
      minWidth: number;
      width: number;
    };

    type baselayout = baseview & EventSystem<events.baselayout> & {
      cols: Partial<ViewConfig>[];
      responsive: string;
      rows: Partial<ViewConfig>[];
      visibleBatch: string;
    };

    type layout = baselayout & EventSystem<events.layout> & {
      isolate: boolean;
      margin: number;
      padding: number;
      paddingX: number;
      paddingY: number;
      type: "line" | "clean" | "wide" | "space" | "form";
    };
  }

  namespace ui {
    type baselayout = baseview & EventSystem<events.baselayout> & {
      config: config.baselayout;

      addView(view: Partial<ViewConfig>, index?: number): string;
      index(view: baseview): number;
      reconstruct(): void;
      removeView(view: baseview | string): void;
      resizeChildren(): void;
      // TODO: What does factory do?
      restore(state: LayoutState, factory?: () => void): void;
      serialize(serializer?: () => void): LayoutState;
      showBatch(name: string): void;
    };

    type baseview = Settings & Destruction & {
      config: config.baseview;

      adjust(): void;
      disable(): void;
      enable(): void;
      getChildViews(): baseview[];
      getFormView(): form;
      getNode(): HTMLElement;
      getParentView(): baseview;
      getTopParentView(): baseview;
      hide(): void;
      isEnabled(): boolean;
      isVisible(): boolean;
      queryView<T extends baseview>(config: (Partial<T["config"]>) | ((view: T) => boolean), mode: "parent" | "self"): baseview;
      queryView<T extends baseview>(config: (Partial<T["config"]>) | ((view: T) => boolean), mode: "all"): baseview[];
      queryView<T extends baseview>(config: (Partial<T["config"]>) | ((view: T) => boolean)): baseview[];
      resize(): void;
      show(force?: boolean, animation?: boolean): void;
      unbind(): void;
    };

    type form = {};

    type layout = baselayout & EventSystem<events.layout> & {
      config: config.layout;
    };

    type toolbar = layout & Scrollable & {

    };

    type view = baseview & {};
  }
}
