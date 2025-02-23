import { type Accessor, type JSX, Show, type VoidComponent, createUniqueId } from 'solid-js';

interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'class'> {
  label?: JSX.Element;
  description?: JSX.Element;
  value: Accessor<string>;
  onChange: (value: string) => void;
  className?: string;
}

export const Input: VoidComponent<InputProps> = ({
  value,
  onChange,
  className,
  label,
  description,
  id = createUniqueId(),
  ...rest
}) => {
  const descriptionId = description !== undefined ? createUniqueId() : undefined;

  return (
    <div class={className}>
      <Show when={label}>
        <label for={id} class="block font-bold mb-1">
          {label}
        </label>
      </Show>

      <input
        {...rest}
        class={INPUT_CLASSES}
        value={value()}
        onInput={({ currentTarget }) => onChange(currentTarget.value)}
        aria-describedby={description ? descriptionId : undefined}
      />

      <Show when={description}>
        <div id={descriptionId} class="italic text-md mt-2">
          {description}
        </div>
      </Show>
    </div>
  );
};

const INPUT_CLASSES = `
w-full
justify-self-start
leading-none
text-base
text-text-default
rounded-lg
px-1
py-0.5
border
border-surface-500
bg-surface-700
focus:border-primary-500
invalid:border-error-500
focus:outline-none`;
