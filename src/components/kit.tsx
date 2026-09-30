import { useId } from "react";
import type { ReactNode } from "react";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="input"
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="textarea"
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export function Btn({
  children,
  onClick,
  kind = "default",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  kind?: "primary" | "default" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button className={`btn ${kind}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Badge({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "alert" | "muted" | "info";
  children: ReactNode;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function Banner({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "alert" | "info";
  children: ReactNode;
}) {
  return <div className={`banner ${tone}`}>{children}</div>;
}

export function PhotoSlot({ name }: { name: string }) {
  return (
    <div className="photo">
      <span className="photo-mark">写真</span>
      <span>{name}</span>
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="btn"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" className="btn" onClick={() => onChange(Math.max(0, value - 1))}>
        −
      </button>
      <span className="stepper-value">{value}</span>
      <button type="button" className="btn" onClick={() => onChange(value + 1)}>
        ＋
      </button>
    </div>
  );
}

export function Block({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="stack tight">
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}

export function Preview({ title, text }: { title: string; text: string }) {
  return (
    <Block title={title}>
      <pre className="export">{text}</pre>
    </Block>
  );
}
