import { routes } from '@/config/routes';
import { DUMMY_ID } from '@/config/constants';
import {
  PiShoppingCartDuotone,
  PiHeadsetDuotone,
  PiPackageDuotone,
  PiChartBarDuotone,
  PiCurrencyDollarDuotone,
  PiSquaresFourDuotone,
  PiGridFourDuotone,
  PiFeatherDuotone,
  PiChartLineUpDuotone,
  PiMapPinLineDuotone,
  PiUserGearDuotone,
  PiBellSimpleRingingDuotone,
  PiUserDuotone,
  PiEnvelopeSimpleOpenDuotone,
  PiStepsDuotone,
  PiCreditCardDuotone,
  PiTableDuotone,
  PiBrowserDuotone,
  PiHourglassSimpleDuotone,
  PiUserCircleDuotone,
  PiShootingStarDuotone,
  PiRocketLaunchDuotone,
  PiFolderLockDuotone,
  PiBinocularsDuotone,
  PiHammerDuotone,
  PiNoteBlankDuotone,
  PiUserPlusDuotone,
  PiShieldCheckDuotone,
  PiLockKeyDuotone,
  PiChatCenteredDotsDuotone,
  PiCalendarPlusDuotone,
  PiEnvelopeDuotone,
  PiCurrencyCircleDollarDuotone,
  PiBriefcaseDuotone,
  PiHouseLineDuotone,
  PiAirplaneTiltDuotone,
  PiFoldersDuotone,
  PiCaretCircleUpDownDuotone,
  PiListNumbersDuotone,
  PiCoinDuotone,
  PiCalendarDuotone,
  PiShapesDuotone,
  PiNewspaperClippingDuotone,
  PiTruckDuotone,
  PiQuestionBold,
  PiMonitorPlay
} from 'react-icons/pi';

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  // label start
  {
    name: 'sidebar-menu-overview',
  },
  // label end
  {
    name: 'sidebar-menu-dashboard',
    href: '/',
    icon: <PiFoldersDuotone />,
  },
  {
    name: 'sidebar-menu-plans',
    href: routes.plans,
    icon: <PiTableDuotone />,
  },
  {
    name: 'sidebar-menu-reviews',
    href: routes.reviews,
    icon: <PiShootingStarDuotone />,
  },
  {
    name: 'sidebar-menu-buyers',
    href: routes.buyers,
    icon: <PiCurrencyCircleDollarDuotone />,
  },
  {
    name: 'sidebar-menu-stores',
    href: routes.stores,
    icon: <PiHouseLineDuotone />,
  },
  {
    name: 'sidebar-menu-accounts',
    href: routes.accounts,
    icon: <PiUserGearDuotone />,
  },
  {
    name: 'sidebar-menu-traders',
    href: routes.traders,
    icon: <PiUserCircleDuotone />,
  },
  {
    name: 'sidebar-menu-delivery',
    href: routes.delivery,
    icon: <PiTruckDuotone />,
  },
  {
    name: 'sidebar-menu-faq',
    href: routes.faq,
    icon: <PiQuestionBold />,
  },
  {
    name: 'sidebar-menu-artical',
    href: routes.artical,
    icon: <PiMonitorPlay />,
  },
  {
    name: 'sidebar-menu-transaction',
    href: routes.transaction,
    icon: <PiCurrencyDollarDuotone />,
  },
  // // label start
  // {
  //   name: 'sidebar-menu-widgets',
  // },
  // // label end
  // {
  //   name: 'sidebar-menu-cards',
  //   href: routes.widgets.cards,
  //   icon: <PiSquaresFourDuotone />,
  // },
  // {
  //   name: 'sidebar-menu-charts',
  //   href: routes.widgets.charts,
  //   icon: <PiChartLineUpDuotone />,
  // },
  // // label start
  // {
  //   name: 'sidebar-menu-forms',
  // },
  // // label end
  // {
  //   name: 'sidebar-menu-account-settings',
  //   href: routes.forms.profileSettings,
  //   icon: <PiUserGearDuotone />,
  // },
  // {
  //   name: 'sidebar-menu-notification-preference',
  //   href: routes.forms.notificationPreference,
  //   icon: <PiBellSimpleRingingDuotone />,
  // },
  // {
  //   name: 'sidebar-menu-personal-information',
  //   href: routes.forms.personalInformation,
  //   icon: <PiUserDuotone />,
  // },
  // {
  //   name: 'sidebar-menu-newsletter',
  //   href: routes.forms.newsletter,
  //   icon: <PiEnvelopeSimpleOpenDuotone />,
  // },
];
