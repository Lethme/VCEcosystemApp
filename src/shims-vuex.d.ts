import { Store } from "@/store";
import {Service, User} from "@/api/services/types";
import {WindowSize} from "@/plugins/windowSize";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
    $authorized: boolean;
    $user: User | undefined;
    $rootAccess: boolean;
    $date: Date;
    $formattedDate: string;
    $windowSize: WindowSize,
    $windowHeight: number;
    $windowWidth: number;
    $mobile: boolean;
    $services: Array<Service>;
    $daysToRemoveOrders: number;
    $pictureFallback: string;

    refreshServices: () => Promise<void>;
  }
}
