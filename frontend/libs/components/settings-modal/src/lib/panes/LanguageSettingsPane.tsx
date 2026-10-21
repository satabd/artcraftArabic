import { CheckIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Label } from "@storyteller/ui-label";
import {
  LANGUAGE_OPTIONS,
  useLocaleStore,
  useTranslation,
} from "@storyteller/common";

export const LanguageSettingsPane = () => {
  const language = useLocaleStore((s) => s.language);
  const setLanguage = useLocaleStore((s) => s.setLanguage);
  const { t } = useTranslation();

  return (
    <div className="space-y-4 pt-3 text-base-fg">
      <div className="flex flex-col gap-0.5">
        <Label>{t("settings.language.title")}</Label>
        <p className="text-xs opacity-70">
          {t("settings.language.description")}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {LANGUAGE_OPTIONS.map((option) => {
          const isSelected = language === option.id;
          return (
            <button
              key={option.id}
              className={twMerge(
                "group flex items-center gap-3 border p-2 text-start transition-colors duration-100",
                isSelected
                  ? "border-base-fg/70 bg-base-fg/10"
                  : "border-ui-panel-border bg-base-fg/[0.03] hover:border-base-fg/30 hover:bg-base-fg/[0.06]",
              )}
              onClick={() => setLanguage(option.id)}
              aria-pressed={isSelected}
              lang={option.id}
              dir={option.direction}
            >
              <span className="flex flex-1 flex-col">
                <span className="text-sm font-semibold">
                  {option.nativeLabel}
                </span>
                {option.nativeLabel !== option.englishLabel && (
                  <span className="text-[11px] opacity-60" lang="en" dir="ltr">
                    {option.englishLabel}
                  </span>
                )}
              </span>
              {isSelected && (
                <CheckIcon aria-hidden className="me-1 h-3.5 w-3.5 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs opacity-70">{t("settings.language.rtlNote")}</p>
    </div>
  );
};
