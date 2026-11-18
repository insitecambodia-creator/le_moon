// Menus live at fixed addresses so links, QR codes and Google never break.
// Monthly update: replace the file in public/menus/ with the same name, update
// `updated` below, commit. That's all.
export const menus = {
  updated: 'November 2026',
  food: { href: '/menus/food.pdf', label: 'Food menu', available: true },
  drinks: { href: '/menus/drinks.pdf', label: 'Drinks menu', available: true },
  kids: { href: '/menus/kids.webp', label: "Kids' menu", available: true },
};
