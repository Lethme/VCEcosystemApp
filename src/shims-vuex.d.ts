import { Store } from "@/store";
import {Notification, Service, User} from "@/api/services/types";
import {WindowSize} from "@/plugins/windowSize";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
    $authorized: boolean;
    $user: User | undefined;
    $rootAccess: boolean;
    $moderAccess: boolean;
    $operatorAccess: boolean;
    $locale: LocaleRecord;
    $localeRecords: Array<LocaleRecord>;
    $date: Date;
    $formattedDate: string;
    $windowSize: WindowSize,
    $windowHeight: number;
    $windowWidth: number;
    $mobile: boolean;
    $services: Array<Service>;
    $allServices: Array<Service>;
    $removedServices: Array<Service>;
    $daysToRemoveOrders: number;
    $pictureFallback: string;
    $notifications: Array<Notification>;
    $readNotifications: Array<Notification>;
    $unreadNotifications: Array<Notification>;

    readNotification: (id) => Promise<void>;
    readAllNotifications: () => Promise<void>;
    removeNotification: (id) => Promise<void>;
    removeAllNotifications: () => Promise<void>;

    refreshServices: () => Promise<void>;
    refreshUserInfo: (useLoader?: boolean) => Promise<void>;
  }
}
