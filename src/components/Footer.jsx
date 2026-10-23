import { NavLink } from "react-router";

import homeIcon from "../assets/nav-home.svg";
import recipesIcon from "../assets/nav-recipes.svg";
import learnIcon from "../assets/nav-learn.svg";
import profileIcon from "../assets/nav-profile.svg";

const menuItems = [
  {
    label: "Home",
    to: "/",
    icon: homeIcon,
    size: 22,
  },
  {
    label: "Recipes",
    to: "/recipes",
    icon: recipesIcon,
    size: 22,
  },
  {
    label: "Learn",
    to: "/blog",
    icon: learnIcon,
    size: 22,
  },
  {
    label: "Profile",
    to: "/login",
    icon: profileIcon,
    size: 24,
  },
];

export default function Footer() {
  return (
    <footer className="h-[calc(76px+env(safe-area-inset-bottom,0px))] shrink-0">
      <nav
        aria-label="Main navigation"
        className="
          fixed inset-x-0 bottom-0 z-50
          bg-dark-humor font-the-one
          pb-[env(safe-area-inset-bottom,0px)]
        "
      >
        <div className="grid h-[76px] grid-cols-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? "var(--color-rhodophobia)"
                  : "var(--color-dark-humor)",
              })}
              className="
                flex min-w-0 flex-col
                items-center justify-center gap-[4px]
                text-[10px] leading-[1.4]
                font-normal text-white no-underline
                focus-visible:outline-2
                focus-visible:-outline-offset-2
                focus-visible:outline-white
              "
            >
              <span className="flex h-[24px] items-center justify-center">
                <img
                  src={item.icon}
                  alt=""
                  width={item.size}
                  height={item.size}
                  className="block shrink-0"
                />
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </footer>
  );
}