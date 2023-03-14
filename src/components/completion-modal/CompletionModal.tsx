import { Signal, useBrowserVisibleTask$ } from "@builder.io/qwik";
import { component$, $, useStylesScoped$ } from "@builder.io/qwik";
import type { GuessOrHint } from "~/logic/GameState";
import { generateRenderableIDSPreview } from "~/logic/Scoring";
import { Guess } from "../guess/Guess";
import styles from './CompletionModal.css?inline';


export const CompletionModal = component$((props: {
  ref: Signal<HTMLDialogElement | undefined>,
  guessCount: number,
  hintCount: number,
}) => {
  useStylesScoped$(styles);

  useBrowserVisibleTask$(({ track }) => {
    if (props.ref.value?.open) {
      const prev = JSON.parse(localStorage.getItem('prev') ?? '[]');
      localStorage.setItem("prev", JSON.stringify([...prev, { guesses: props.guessCount, hints: props.hintCount }]));
    }
  });
  return <dialog ref={props.ref}>
    <section>
      <h2>You did it!</h2>
      And it only took
      <ul>
        {props.hintCount > 0 ? <li><span class="count">{props.hintCount}</span> hint{props.hintCount > 1 ? "s" : ""},</li> : null}
        <li><span class="count">{props.guessCount}</span> guesses</li>
      </ul>
    </section>

    <button onClick$={() => {
      location.reload();
    }}>Try again</button>
  </dialog>;
});
