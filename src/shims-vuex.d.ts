import { Store } from "@/store";
import {User} from "@/api/services/types";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
    $authorized: boolean;
    $user: User | undefined;
    $date: Date;
    $formattedDate: string;
  }
}
