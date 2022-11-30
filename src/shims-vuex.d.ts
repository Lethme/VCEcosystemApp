import { Store } from "@/store";
import { Loader } from "@/utils";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
    $loader: Loader;
  }
}
