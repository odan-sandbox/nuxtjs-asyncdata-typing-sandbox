import Vue, { ComponentOptions } from "vue";
import { CombinedVueInstance } from "../node_modules/vue/types/vue";

type DataDef<Data, Props, V> = Data | ((this: Readonly<Props> & V) => Data);

type DefaultAsyncData<V> =
  | object
  | ((this: V, context: any) => Promise<object | void> | object | void);

type ThisTypedComponentOptionsWithArrayPropsAndAsyncData<
  V extends Vue,
  Data,
  Methods,
  Computed,
  PropNames extends string,
  AsyncData
> = object &
  ComponentOptions<
    V,
    DataDef<Data, Record<PropNames, any>, V>,
    Methods,
    Computed,
    PropNames[],
    Record<PropNames, any>,
    DataDef<AsyncData, Record<PropNames, any>, V>
  > &
  ThisType<
    CombinedVueInstance<
      V,
      Data,
      Methods,
      Computed,
      Readonly<Record<PropNames, any>>
    > &
      AsyncData
  >;

declare module "vue/types/options" {
  interface ComponentOptions<
    V extends Vue,
    Data = DefaultData<V>,
    Methods = DefaultMethods<V>,
    Computed = DefaultComputed,
    PropsDef = PropsDefinition<DefaultProps>,
    Props = DefaultProps,
    AsyncData = DefaultAsyncData<V>
  > {
    asyncData?: AsyncData;
  }
}

declare module "vue/types/vue" {
  interface VueConstructor<V extends Vue> {
    extend<Data, Methods, Computed, PropNames extends string, AsyncData>(
      options?: ThisTypedComponentOptionsWithArrayPropsAndAsyncData<
        V,
        Data,
        Methods,
        Computed,
        PropNames,
        AsyncData
      >
    ): ExtendedVue<V, Data, Methods, Computed, Record<PropNames, any>>;
  }
}

export default Vue.extend({
  asyncData() {
    return { a: 10 };
  },
  data: () => ({ b: 10 }),
  methods: {
    click(): void {
      console.log(this.a);
    },
  },
});
