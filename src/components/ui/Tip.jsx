import Card from "./Card";
import Eyebrow from "./Eyebrow";

import freezingIcon from "../../assets/tip-freezing.svg";
import packingIcon from "../../assets/tip-packing.svg";
import labelIcon from "../../assets/tip-label.svg";
import leafIcon from "../../assets/tip-leaf.svg";

const variants = {
  1: { card: "default", label: "A LITTLE HELP" },
  2: { card: "default", label: "STORAGE TIPS" },
  3: { card: "profileA", label: "ONE THING TO REMEMBER" },
};

const icons = {
  freezing: freezingIcon,
  packing: packingIcon,
  label: labelIcon,
};

export default function Tip({ variant = 1, children, items = [] }) {
  const selected = variants[variant] || variants[1];

  return (
    <Card
      variant={selected.card}
      className={`w-full rounded-card px-card-lg font-the-one text-dark-humor ${
        variant === 2 ? "py-[4px]" : "py-card-lg"
      }`}
    >
      {variant === 2 ? (
        <ul className="m-0 list-none p-0 divide-y divide-rose-fantasy">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-[12px] py-[18px]"
            >
              <img
                src={icons[item.icon]}
                alt=""
                width={16}
                height={16}
                className="shrink-0"
              />

              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold">
                  {item.title}
                </p>

                <p className="mt-[6px] text-[13px] leading-[18px]">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col gap-[8px]">
          {variant === 3 ? (
            <div className="flex items-center gap-[8px]">
              <img
                src={leafIcon}
                alt=""
                width={18}
                height={18}
                className="shrink-0"
              />

              <p className="text-[11px] leading-[16px] font-semibold">
                {selected.label}
              </p>
            </div>
          ) : (
            <Eyebrow content={selected.label} />
          )}

          <p
            className={
              variant === 3
                ? "text-[16px] leading-[24px] font-semibold"
                : "text-body"
            }
          >
            {children}
          </p>
        </div>
      )}
    </Card>
  );
}