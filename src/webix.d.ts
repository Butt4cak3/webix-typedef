declare namespace webix {
  function ui<K extends keyof UIMap>(config: ConfigWithView<K>, parent?: ui.baseview | string, replacement?: ui.baseview | string | number): UIMap[K]["view"];

  type ConfigWithView<K extends keyof UIMap> = { view: K } & Partial<UIMap[K]["config"]>;

  type ViewConfig = {
    [K in keyof UIMap]: ConfigWithView<K>;
  }[keyof UIMap];

  interface UIMap {
    form: { config: config.form, view: ui.form };
    layout: { config: config.layout, view: ui.layout };
    toolbar: { config: config.toolbar, view: ui.toolbar };
  }

  type DataType = "json" | "xml" | "jsarray" | "csv";

  interface AjaxResponse<T extends {} = any> {
    json(): T;
  }

  interface AtomDataLoader<T> {
    load(url: string, type?: DataType, callback?: (text: string, data: AjaxResponse<T>, http_request: XMLHttpRequest) => void): Promise;
    parse(data: T | string, type: DataType): void;
  }

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

  interface Promise {
    reject(reason: any): Promise;
    resolve(result: any): Promise;
    then(resCallback: (result: any) => any, rejCallback?: (reason: any) => any): Promise;
    catch(rejCallback: (result: any) => any): Promise;
  }

  namespace promise {
    function all(promises: Promise[]): Promise;
    function defer(): Promise;
    function race(promises: Promise[]): Promise;
    function reject(reason: any): Promise;
    function resolve(result: any): Promise;
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

  interface ValidateData {
    clearValidation(): void;
    validate(mode?: { hidden?: boolean, disabled?: boolean }): boolean;
  }

  interface Values<T> {
    clear(): void;
    focus(item: string): void;
    getCleanValues(): T;
    getDirtyValues(): T;
    getValues(): T;
    getValues(details: { hidden?: boolean, disabled?: boolean }): T;
    getValues(iterator: (item: ui.baseview) => void): T;
    isDirty(): boolean;
    markInvalid(name: keyof T, state: boolean | string): void;
    setDirty(mark: boolean): void;
    setValues(obj: T, update?: boolean): void;
  }

  // TODO: What does LayoutState look like?
  interface LayoutState {}

  namespace events {
    interface EventList {}

    interface AtomDataLoader<T> extends EventList {
      onAfterLoad: () => void;
      onBeforeLoad: () => boolean | void;
      onLoadError: (text: string, xml: T, xhr: XMLHttpRequest) => void;
    }

    interface Scrollable extends EventList {
      onAfterScroll: () => void;
    }

    interface ValidateData<T> extends EventList {
      onAfterValidation: (result: boolean, value: T) => void;
      onBeforeValidate: () => void;
      onValidationError: (key: keyof T, obj: T) => void;
      onValidationSuccess: (key: keyof T, obj: T) => void;
    }

    interface Values extends EventList {
      onAfterLoad: () => void;
      onChange: (newv: string, oldv: string) => void;
      onValues: () => void;
    }

    interface baseview extends EventList {
      onBindRequest: () => void;
      onDestruct: () => void;
    }

    interface baselayout extends baseview {}

    interface layout extends baselayout, Scrollable {}

    interface toolbar<T> extends layout, AtomDataLoader<T>, Scrollable, ValidateData<T>, Values {}
  }

  namespace config {
    type AtomDataLoader<T> = {
      data: T[] | string;
      dataFeed: (text: string) => void | string;
      datatype: DataType;
      url: string;
    };

    type EventSystem<E extends events.EventList> = {
      on: Partial<E>;
    };

    type Scrollable = {
      scroll: boolean | "x" | "y" | "xy";
      scrollSpeed: string;
    };

    type ValidateData<T> = {
      rules: {
        [K in keyof T]: (value: T[K]) => boolean;
      }
    };

    type Values = {
      complexData: boolean;
    };

    type baseview = {
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
      cols: ViewConfig[];
      responsive: string;
      rows: ViewConfig[];
      visibleBatch: string;
    };

    type form = baseview & {};

    type layout = baselayout & EventSystem<events.layout> & {
      isolate: boolean;
      margin: number;
      padding: number;
      paddingX: number;
      paddingY: number;
      type: "line" | "clean" | "wide" | "space" | "form";
    };

    type toolbar<T extends {} = any> = layout & AtomDataLoader<T> & Scrollable & ValidateData<T> & Values & EventSystem<events.toolbar<T>> & {
      // TODO: Figure out how to do this without TS complaining about circular references
      //elements: ViewConfig[];
      elementsConfig: {
        [K in keyof UIMap]: Partial<UIMap[K]["config"]>
      }[keyof UIMap]
    };
  }

  namespace ui {
    type baselayout = baseview & EventSystem<events.baselayout> & {
      config: config.baselayout;

      addView(view: ViewConfig, index?: number): string;
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

    type toolbar<T extends {} = any> = layout & Scrollable & ValidateData & Values<T> & EventSystem<events.toolbar<T>> & {
      config: config.toolbar<T>;

      render(id?: string, data?: T, type?: "add" | "delete" | "move" | "update"): void;
    };

    type view = baseview & {};
  }
}
