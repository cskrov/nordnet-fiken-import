import { Input } from '@app/components/Input';
import { type Accessor, For, type JSX, Show, createEffect, createReaction, createSignal, onCleanup } from 'solid-js';

interface Option<T> {
  value: T;
  label: string;
  detail?: string;
}

interface InputDropdownProps<T> {
  placeholder: string;
  options: Accessor<Option<T>[]>;
  onChange: (value: string) => void;
  search: Accessor<string>;
  onSelect: (value: T) => void;
  fallback?: string;
  autofocus?: boolean;
}

export const InputDropdown = <T,>({
  search,
  onChange,
  placeholder,
  options,
  onSelect,
  fallback,
  autofocus,
}: InputDropdownProps<T>): JSX.Element => {
  const maxFocus = () => options().length - 1;
  const [focus, setFocus] = createSignal<number>(-1);
  const [isOpen, setIsOpen] = createSignal(true);

  const isListOpen = () => isOpen() && options().length > 0;

  const onKeyDown = (e: KeyboardEvent) => {
    const { key } = e;
    if (key === 'ArrowDown') {
      if (!isOpen()) {
        setIsOpen(true);
      }
      setFocus((f) => (f + 1) % (maxFocus() + 1));
    } else if (key === 'ArrowUp') {
      if (focus() === 0) {
        setIsOpen(false);
        setFocus(-1);
      } else {
        setFocus((f) => f - 1);
      }
    } else if (key === 'Enter' && focus() !== -1) {
      const option = options()[focus()];

      if (option !== undefined) {
        onSelect(option.value);
        setIsOpen(false);
      }
    } else if (key === 'Escape') {
      setFocus(-1);

      if (isListOpen()) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
        return;
      }

      if (search().length !== 0) {
        e.preventDefault();
        e.stopPropagation();
        onChange('');
        return;
      }
    }
  };

  createReaction(() => {
    setIsOpen(true);
  })(options);

  let containerRef: HTMLElement | null = null;
  let inputRef: HTMLInputElement | null = null;
  let listRef: HTMLUListElement | null = null;

  createEffect(() => {
    if (containerRef === null || inputRef === null) {
      return;
    }

    const onClickOutside = (e: MouseEvent) => {
      if (
        containerRef !== null &&
        inputRef !== null &&
        e.target !== inputRef &&
        !containerRef.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setFocus(-1);
      }
    };

    window.addEventListener('click', onClickOutside);

    onCleanup(() => {
      window.removeEventListener('click', onClickOutside);
    });
  });

  const onBlur = () => {
    setFocus(-1);

    // setTimeout is needed to allow the activeElement to update.
    setTimeout(() => {
      if (listRef === null) {
        return;
      }

      if (!listRef.contains(document.activeElement)) {
        setIsOpen(false);
      }
    });
  };

  return (
    <section
      class="relative"
      ref={(ref) => {
        containerRef = ref;
      }}
    >
      <Input
        type="search"
        className="grow w-full"
        placeholder={placeholder}
        value={search}
        onChange={(v) => {
          setIsOpen(true);
          onChange(v);
        }}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={() => setIsOpen(true)}
        autofocus={autofocus}
        ref={(ref) => {
          inputRef = ref;
        }}
      />

      <Show when={isListOpen()}>
        <ul
          class="list-none absolute top-full left-0 bg-surface-700 border border-surface-500 rounded-lg w-fit min-w-full overflow-hidden shadow-md"
          ref={(ref) => {
            listRef = ref;
          }}
        >
          <For each={options()} fallback={fallback === undefined ? undefined : <option disabled>{fallback}</option>}>
            {({ label, detail, value }, index) => (
              <li class="whitespace-nowrap">
                <button
                  type="button"
                  class={`block cursor-pointer w-full text-left py-1 px-2 ${index() === focus() ? 'bg-primary-500' : 'bg-transparent'}`}
                  onClick={() => onSelect(value)}
                  onMouseEnter={() => setFocus(index())}
                  onFocus={() => setFocus(index())}
                >
                  <div>{label}</div>
                  <Show when={detail}>{(d) => <div class="text-md italic">{d()}</div>}</Show>
                </button>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </section>
  );
};
