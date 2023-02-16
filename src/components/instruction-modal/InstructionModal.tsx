import type { PropFunction, Signal } from "@builder.io/qwik";
import { component$, $, useStylesScoped$ } from "@builder.io/qwik";
import { Guess } from "../guess/Guess";
import styles from './InstructionModal.css?inline';


export const InstructionModal = component$((props: { ref: Signal<HTMLDialogElement | undefined>, close$: PropFunction<() => void>; }) => {
  useStylesScoped$(styles);
  return <dialog ref={props.ref}>
    <h2>How to play:</h2>
    Guess the 汉字.
    <ul>
      <li>Each guess must be a single (简体中文) 汉字</li>
      <li>You will need to use Chinese input on your device. &nbsp;
        <a href="https://yoyochinese.com/blog/how-to-type-in-chinese-on-any-device#:~:text=1%20STEP%201.%20Open%20up%20the%20%22Time%20and,confirm%20the%20language%20selection%3A%205%20STEP%205.%20">
          Don't know how?
        </a> </li>
      <li>Different components will change color to show how close they were.</li>
      <li>Having trouble? Press hint/线索 for a clue.</li>
    </ul>
    <h3>Examples</h3>
    <ul>
      <li></li>
    </ul>
    <button onClick$={() => {
      localStorage.setItem("wasInstructed", "true");
      props.close$();
    }}>加油！</button>
  </dialog>;
});
