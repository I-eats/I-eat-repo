import { CookBookIcon, EarthIcon, Flag01Icon, GiftIcon, TruckIcon } from "@hugeicons-pro/core-stroke-rounded";

export const stages = [
  // {
  //   status: 'pending',
  //   title: "Order Placed",
  //   subtitle: "We have received your order",
  //   icon: Flag01Icon,
  // },
  {
    status: 'pending',
    title: "Finding Deliverer",
    subtitle: "Looking for a deliverer to pick up your order",
    icon: EarthIcon,
  },
  {
    status: 'accepted',
    title: "Preparing Food",
    subtitle: "The restaurant is preparing your food",
    icon: CookBookIcon,
  },
  {
    status: 'picked_up',
    title: "Out for Delivery",
    subtitle: "Your deliverer is on the way",
    icon: TruckIcon,
  },
  {
    status: 'delivered',
    title: "Delivered",
    subtitle: "Your order has been delivered",
    icon: GiftIcon,
  },
];
