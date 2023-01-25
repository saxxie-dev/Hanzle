import { component$, PropFunction, useStore, useStylesScoped$ } from "@builder.io/qwik";
import { Queries } from "~/logic/queries";
import { Guess } from "../guess/Guess";
import styles from './input.css?inline';

type State = {
  justComposed: boolean,
  warning?: string,
}

type InputProps = {
  guess: string;
  setGuess$: PropFunction<(s: string) => void>;
}
export default component$((props: InputProps) => {
  useStylesScoped$(styles);
  const store = useStore<State>({
    justComposed: false,
  });
  return <section>
    {store.warning}
    <div>
      <input
        type="text"
        autoFocus={true}
        value={props.guess}
        onCompositionStart$={() => {
          store.justComposed = true;
          store.warning = undefined;
        }}
        onCompositionEnd$={e => {
          props.setGuess$(e.data);
        }}
        onInput$={e => {
          props.setGuess$((e as any).target.value);
          if ((e as any).isComposing) {
            return;
          }
          if (store.justComposed) {
            store.justComposed = false;
            return;
          }
          if (!(e as any).data) {
            return;
          }
          store.warning = "bad";
        }} /><button>Guess</button>
    </div>
  </section>;

});

const findZhCharRegex = /^\p{UIdeo=y}*$/u

