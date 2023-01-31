import { component$, PropFunction, useStore, useStylesScoped$ } from "@builder.io/qwik";
import { generateRenderableIDSGuess, GuessMatches } from "~/logic/Scoring";
import { Guess } from "../guess/Guess";
import styles from './NewInput.css?inline';

type State = {
  justComposed: boolean,
  warning?: string,
}

type InputProps = {
  guess: string;
  setGuess$: PropFunction<(s: string) => void>;
  secretKnowledge: GuessMatches;
}
export default component$((props: InputProps) => {
  useStylesScoped$(styles);
  const store = useStore<State>({
    justComposed: false,
  });

  return <><section>

    <Guess char={generateRenderableIDSGuess(props.guess, props.secretKnowledge)} />
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
          const zhmatches = [...e.data.matchAll(findZhCharRegex)];
          if (!zhmatches?.length) { props.setGuess$(""); }
          props.setGuess$(zhmatches[zhmatches.length - 1] as any);
        }}
        onInput$={ee => {
          const e = ee as InputEvent & { target: HTMLInputElement };
          const zhmatches = [...e.target.value.matchAll(findZhCharRegex)];
          if (e.isComposing) {
            return;
          }
          if (zhmatches?.length) {
            props.setGuess$(zhmatches[zhmatches.length - 1] as any);
          }
          if (store.justComposed) {
            store.justComposed = false;
            return;
          }
          if (!e.data) {
            if (e.target.value === "") { props.setGuess$("") }
            return;
          }
          (e as any).target.value = props.guess;
          store.warning = "Make sure you are using your machine's Chinese IME to input a character";
        }} />
    </div>
  </section>
    <div class="warning">
      <div class="warn2">
        {store.warning}
      </div>
    </div></>;

});


export const findZhCharRegex = /[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/g;
