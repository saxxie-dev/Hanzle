import type { PropFunction, Signal } from "@builder.io/qwik";
import { component$, $, useStylesScoped$ } from "@builder.io/qwik";
import { generateRenderableIDSPreview } from "~/logic/Scoring";
import { Guess } from "../guess/Guess";
import styles from './InstructionModal.css?inline';


export const InstructionModal = component$((props: { ref: Signal<HTMLDialogElement | undefined>, close$: PropFunction<() => void>; }) => {
  useStylesScoped$(styles);
  return <dialog ref={props.ref}>
    <section>
      <h2>How to play:</h2>
      Guess the 汉字.
      <ul>
        <li>Each guess must be a single (简体中文) 汉字.</li>
        <li>You will need to use Chinese input. &nbsp;
          <a href="https://yoyochinese.com/blog/how-to-type-in-chinese-on-any-device#:~:text=1%20STEP%201.%20Open%20up%20the%20%22Time%20and,confirm%20the%20language%20selection%3A%205%20STEP%205.%20">
            Don't know how?
          </a> </li>
        <li>Components will change color to show how close you were.</li>
      </ul>
    </section>
    <section>
      <h3>Examples</h3>
      <div class="guessExplanation">
        <div class='tinyGuess'><Guess char={generateRenderableIDSPreview("你", {
          '人': {
            type: 'present',
            knownPositions: [{
              x: 0,
              y: 0,
              h: 12,
              w: 6,
            }],
          }
        })} />
        </div>
        <div>
          <strong>人</strong> is on the left-hand side of the 字.
        </div>
      </div>
      <div class="guessExplanation">
        <div class='tinyGuess'><Guess char={generateRenderableIDSPreview("好", {
          '女': {
            type: 'present',
            knownPositions: [],
          }
        })} />
        </div>
        <div>
          <strong>女</strong> is in the 字, but doesn't cover the left side.
        </div>
      </div>
      <div class="guessExplanation">
        <div class='tinyGuess'><Guess char={generateRenderableIDSPreview("吗", {
          '马': {
            type: 'absent',
          }
        })} />
        </div>
        <div>
          <strong>马</strong> is not contained anywhere in the 字.
        </div>
      </div>
    </section>

    <button onClick$={() => {
      localStorage.setItem("wasInstructed", "true");
      props.close$();
    }}>加油!</button>
  </dialog>;
});
