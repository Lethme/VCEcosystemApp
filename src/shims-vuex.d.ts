import { Store } from "@/store";
import {User} from "@/api/services/types";
import {WindowSize} from "@/plugins/windowSize";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
    $authorized: boolean;
    $user: User | undefined;
    $date: Date;
    $formattedDate: string;
    $windowSize: WindowSize,
    $windowHeight: number;
    $windowWidth: number;
  }
}
