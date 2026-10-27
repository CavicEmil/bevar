import Card from "./Card";
import Eyebrow from "./Eyebrow";

import freezingIcon from "../../assets/tip-freezing.svg";
import packingIcon from "../../assets/tip-packing.svg";
import labelIcon from "../../assets/tip-label.svg";
import leafIcon from "../../assets/tip-leaf.svg";
import checkIcon from "../../assets/checkmark.svg";

const variants = {
  1: { card: "default", label: "A LITTLE HELP" },
  2: { card: "default", label: "STORAGE TIPS" },
  3: { card: "profileA", label: "ONE THING TO REMEMBER" },
};

const icons = {
  freezing: freezingIcon,
  packing: packingIcon,
  container: packingIcon,
  seal: packingIcon,
  roll: packingIcon,
  label: labelIcon,
  check: checkIcon,
};

export default function Tip({
  variant = 1,
  step,
  children,
  iconSources = {},
}) {
  const activeVariant = variants[variant] ? variant : 1;
  const selected = variants[activeVariant];

  const text = activeVariant === 3 ? children : step?.tip;

  const items = Array.isArray(step?.storage_items)
    ? step.storage_items.filter(
        (item) => item && (item.title?.trim() || item.text?.trim())
      )
    : [];

  if (activeVariant === 1 && !text?.trim()) return null;
  if (activeVariant === 2 && items.length === 0) return null;

  return (
    <Card
      variant={selected.card}
      className={`w-full rounded-card px-card-lg font-the-one text-dark-humor ${
        activeVariant === 2 ? "py-[4px]" : "py-card-lg"
      }`}
    >
      {activeVariant === 2 ? (
        <ul className="m-0 list-none divide-y divide-rose-fantasy p-0">
          {items.map((item, index) => {
            const iconKey = item.icon?.trim().toLowerCase();
            const icon = iconSources[iconKey] ?? icons[iconKey];

            return (
              <li
                key={item.id ?? `${step?.id ?? "storage"}-${index}`}
                className="flex items-start gap-[12px] py-[18px]"
              >
                {icon && (
                  <img
                    src={icon}
                    alt=""
                    width={16}
                    height={16}
                    className="mt-[2px] shrink-0"
                  />
                )}

                <div className="min-w-0 flex-1">
                  {item.title && (
                    <p className="m-0 text-body font-semibold">
                      {item.title}
                    </p>
                  )}

                  {item.text && (
                    <p className="mt-[6px] mb-0 text-[13px] leading-[18px]">
                      {item.text}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col gap-[8px]">
          {activeVariant === 3 ? (
            <div className="flex items-center gap-[8px]">
              <img
                src={leafIcon}
                alt=""
                width={18}
                height={18}
                className="shrink-0"
              />

              <p className="m-0 text-[11px] leading-[16px] font-semibold">
                {selected.label}
              </p>
            </div>
          ) : (
            <Eyebrow content={selected.label} />
          )}

          <p
            className={
              activeVariant === 3
                ? "m-0 text-[16px] leading-[24px] font-semibold"
                : "m-0 text-body"
            }
          >
            {text}
          </p>
        </div>
      )}
    </Card>
  );
}