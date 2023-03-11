import { PropFunction, useBrowserVisibleTask$ } from "@builder.io/qwik";
import { component$, useStore, useStylesScoped$ } from "@builder.io/qwik";
import type { PreviewMatches } from "~/logic/Scoring";
import { generateRenderableIDSPreview } from "~/logic/Scoring";
import { Guess } from "../guess/Guess";
import styles from './Input.css?inline';

type State = {
  value: string,
  caretPosition: number,
  caretMomentum: 'left' | 'right',
  error?: 'invalidSubmit'
};

type InputProps = {
  submit$: PropFunction<(s: string) => void>;
  publicKnowledge: PreviewMatches;
}

export default component$((props: InputProps) => {
  useStylesScoped$(styles);
  const store = useStore<State>({
    value: '',
    caretPosition: 0,
    caretMomentum: 'right',
  });

  // useBrowserVisibleTask$()

  const renderedGuess: string | undefined = getRenderedGuess(store.value, store.caretPosition, store.caretMomentum);
  return <div class="gridAdapter">
    <section class={store.error ? "error" : ""}>
      <div class={renderedGuess ? "show" : "hide"}>
        {renderedGuess && <Guess char={generateRenderableIDSPreview(renderedGuess, props.publicKnowledge)} />}
      </div>
      <div>
        <input
          class={renderedGuess ? "char" : "text"}
          type="text"
          value={store.value}
          autoFocus={true}
          onInput$={(e: InputEvent) => {
            const el: HTMLInputElement = e.target as any;
            store.caretPosition = el.selectionStart ?? store.caretPosition;
            store.caretMomentum = 'right';
            store.value = el.value;
            store.error = undefined;

            if (!renderedGuess && getRenderedGuess(store.value, store.caretPosition, store.caretMomentum)) {
              centerSelectionDuringZoom(el, store.caretMomentum, store.caretPosition);
            }
          }}
          onKeyUp$={e => {
            const el: HTMLInputElement = e.target as any;
            const oldCaretPosition = store.caretPosition;
            store.caretPosition = el.selectionStart ?? store.caretPosition;
            if (store.caretPosition < oldCaretPosition) { store.caretMomentum = 'left'; }
            else if (store.caretPosition > oldCaretPosition) { store.caretMomentum = 'right'; }

            if (!renderedGuess && getRenderedGuess(store.value, store.caretPosition, store.caretMomentum)) {
              centerSelectionDuringZoom(el, store.caretMomentum, store.caretPosition);
            }
          }}
          onKeyDown$={async (e) => {
            if (e.key === "Enter") {
              if (renderedGuess) {
                await props.submit$(renderedGuess);
                store.value = "";
                store.caretPosition = 0;
                store.caretMomentum = 'right';
                store.error = undefined;
              }
              else {
                store.error = 'invalidSubmit';
              }
            } else {
              store.error = undefined;
            }
          }}
          onClick$={(e) => {
            const el: HTMLInputElement = e.target as any;
            const oldCaretPosition = store.caretPosition;
            store.caretPosition = el.selectionStart ?? store.caretPosition;
            store.error = undefined;
            if (store.caretPosition < oldCaretPosition) { store.caretMomentum = 'left'; }
            else if (store.caretPosition > oldCaretPosition) { store.caretMomentum = 'right'; }

            if (!renderedGuess && getRenderedGuess(store.value, store.caretPosition, store.caretMomentum)) {
              centerSelectionDuringZoom(el, store.caretMomentum, store.caretPosition);
            }
          }} />
      </div>
      {store.error && <div class="errorDetails">
        Not a chinese character...
      </div>}
    </section>
  </div>;

});

export const centerSelectionDuringZoom = (el: HTMLInputElement, momentum: 'left' | 'right', position: number) => {
  let counter = 0;
  const helper = () => {
    if (momentum === 'left') {
      el.setSelectionRange(position + 1, position + 1);
    } else {
      el.setSelectionRange(position, position);
    }

    if (counter < 500) {
      counter += 15;
      setTimeout(helper, 15);
    } else {
      el.setSelectionRange(position, position);
    }
  };
  helper();
}


export const findZhCharRegex = /^[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/;

export const getRenderedGuess = (value: string, caretPosition: number, caretMomentum: 'left' | 'right'): string | undefined => {
  if (value.length === 0) { return undefined; }
  if (caretMomentum === 'left') { return value.slice(caretPosition).match(findZhCharRegex)?.[0]; }
  return value.slice(caretPosition - 1).match(findZhCharRegex)?.[0];
}