import { component$, useStylesScoped$ } from "@builder.io/qwik";
import type { Position } from "~/logic/Scoring";
import styles from './Guess.css?inline';


export type HintProps = {
  char: string;
  position: Position;
}

export const Hint = component$((props: HintProps) => {
  useStylesScoped$(styles);
  const { x, y, w, h } = props.position;
  const innerStyle = `
    left: ${x}rem;
    top: ${y}rem;
    width: ${w}rem;
    height: ${h}rem;
    `;
  const textStyle = `
    line-height:${h}rem;
    font-size: ${h * 0.95}rem;
    transform: scaleX(${w / h});`;
  return <div class="Hint"><div class="correct Inner" style={innerStyle}><span style={textStyle}>{props.char}</span></div></div>;
});