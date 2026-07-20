"use client";

import type { Key } from "@heroui/react";
import {
  Label,
  ListBox,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import type { LucideIcon } from "lucide-react";

type SegmentOption = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type SegmentProps = {
  "aria-label": string;
  value: string;
  onChange: (value: string) => void;
  options: SegmentOption[];
  size?: "sm" | "md";
};

/** Figma-style icon segmented control (HeroUI ToggleButtonGroup). */
export function InspectorSegment({
  "aria-label": ariaLabel,
  value,
  onChange,
  options,
  size = "sm",
}: SegmentProps) {
  return (
    <ToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      size={size}
      className="social-tool-segment"
      selectedKeys={new Set([value])}
      onSelectionChange={(keys) => {
        const next = [...keys][0];
        if (next != null) onChange(String(next));
      }}
    >
      {options.map((opt, index) => {
        const Icon = opt.icon;
        return (
          <ToggleButton
            key={opt.id}
            id={opt.id}
            isIconOnly
            aria-label={opt.label}
          >
            {index > 0 ? <ToggleButtonGroup.Separator /> : null}
            <Icon className="size-3.5" />
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}

type SelectOption = {
  id: string;
  label: string;
  description?: string;
};

type InspectorSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
};

export function InspectorSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  className = "",
}: InspectorSelectProps) {
  return (
    <Select
      className={`social-tool-select w-full ${className}`}
      placeholder={placeholder}
      value={value as Key}
      onChange={(next) => {
        if (next != null) onChange(String(next));
      }}
    >
      <Label className="social-tool-label !mb-1.5 !normal-case !tracking-normal">
        {label}
      </Label>
      <Select.Trigger className="w-full">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="min-w-[var(--trigger-width)]">
        <ListBox>
          {options.map((opt) => (
            <ListBox.Item key={opt.id} id={opt.id} textValue={opt.label}>
              <div className="flex flex-col gap-0.5">
                <span>{opt.label}</span>
                {opt.description ? (
                  <span className="text-[11px] text-text-tertiary">
                    {opt.description}
                  </span>
                ) : null}
              </div>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
