import type {
  InputHTMLAttributes,
  OptionHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { SearchIcon } from "@/components/icons/Icons";
import styles from "./FormControls.module.css";

type FieldBase = {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
};

function messageIds(id: string, helperText?: string, error?: string) {
  return [helperText ? `${id}-helper` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ") || undefined;
}

function FieldLabel({ id, label, required }: Pick<FieldBase, "id" | "label" | "required">) {
  return (
    <label className={styles.label} htmlFor={id}>
      <span>{label}</span>
      {required ? (
        <>
          <span className={styles.requiredMark} aria-hidden="true">*</span>
          <span className="pe-visually-hidden"> (required)</span>
        </>
      ) : null}
    </label>
  );
}

function FieldMessages({ id, helperText, error }: Pick<FieldBase, "id" | "helperText" | "error">) {
  return (
    <>
      {helperText ? <span id={`${id}-helper`} className={styles.helper}>{helperText}</span> : null}
      {error ? <span id={`${id}-error`} className={styles.error}>{error}</span> : null}
    </>
  );
}

type TextInputProps = FieldBase & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "required"> & {
  inputRef?: Ref<HTMLInputElement>;
};

export function TextInput({
  id,
  label,
  helperText,
  error,
  required,
  inputRef,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div className={styles.field}>
      <FieldLabel id={id} label={label} required={required} />
      <span className={styles.controlWrap}>
        <input
          id={id}
          ref={inputRef}
          required={required}
          className={`${styles.input} ${error ? styles.errorControl : ""} ${className}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageIds(id, helperText, error)}
          {...props}
        />
      </span>
      <FieldMessages id={id} helperText={helperText} error={error} />
    </div>
  );
}

type SearchInputProps = Omit<TextInputProps, "type">;

export function SearchInput({
  id,
  label,
  helperText,
  error,
  required,
  inputRef,
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={styles.field}>
      <FieldLabel id={id} label={label} required={required} />
      <span className={styles.controlWrap}>
        <span className={styles.searchIcon}><SearchIcon size={18} /></span>
        <input
          id={id}
          ref={inputRef}
          type="search"
          required={required}
          className={`${styles.input} ${styles.searchInput} ${error ? styles.errorControl : ""} ${className}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageIds(id, helperText, error)}
          {...props}
        />
      </span>
      <FieldMessages id={id} helperText={helperText} error={error} />
    </div>
  );
}

type TextareaProps = FieldBase & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "required">;

export function Textarea({ id, label, helperText, error, required, className = "", ...props }: TextareaProps) {
  return (
    <div className={styles.field}>
      <FieldLabel id={id} label={label} required={required} />
      <textarea
        id={id}
        required={required}
        className={`${styles.textarea} ${error ? styles.errorControl : ""} ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageIds(id, helperText, error)}
        {...props}
      />
      <FieldMessages id={id} helperText={helperText} error={error} />
    </div>
  );
}

type SelectProps = FieldBase & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "required"> & { children: ReactNode };

export function Select({ id, label, helperText, error, required, children, className = "", ...props }: SelectProps) {
  return (
    <div className={styles.field}>
      <FieldLabel id={id} label={label} required={required} />
      <select
        id={id}
        required={required}
        className={`${styles.select} ${error ? styles.errorControl : ""} ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageIds(id, helperText, error)}
        {...props}
      >
        {children}
      </select>
      <FieldMessages id={id} helperText={helperText} error={error} />
    </div>
  );
}

export function SelectOption(props: OptionHTMLAttributes<HTMLOptionElement>) {
  return <option {...props} />;
}

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "required"> & {
  id: string;
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
};

function Choice({ id, label, helperText, error, required, type, ...props }: ChoiceProps & { type: "checkbox" | "radio" }) {
  const describedBy = messageIds(id, helperText, error);
  return (
    <div>
      <label className={styles.choiceLabel} htmlFor={id}>
        <input
          id={id}
          type={type}
          required={required}
          className={styles.choice}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />
        <span className={styles.choiceText}>
          <span className={styles.choiceTitle}>
            {label}{required ? <span className={styles.requiredMark} aria-hidden="true"> *</span> : null}
            {required ? <span className="pe-visually-hidden"> (required)</span> : null}
          </span>
          {helperText ? <span id={`${id}-helper`} className={styles.helper}>{helperText}</span> : null}
          {error ? <span id={`${id}-error`} className={styles.error}>{error}</span> : null}
        </span>
      </label>
    </div>
  );
}

export function Checkbox(props: ChoiceProps) {
  return <Choice type="checkbox" {...props} />;
}

export function Radio(props: ChoiceProps) {
  return <Choice type="radio" {...props} />;
}
