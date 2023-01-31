import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { RenderableIDSGuess } from "~/logic/Scoring";
import styles from './Guess.css?inline';


export type GuessProps = {
  char: RenderableIDSGuess
}

export const Guess = component$((props: GuessProps) => {
  useStylesScoped$(styles);
  const { w, h } = props.char.note.position;
  const dimStyle = `width: ${w}rem; 
    height: ${h}rem;`;
  const textStyle = `
    line-height:${h}rem;
    font-size: ${h * 0.95}rem;
    transform: scaleX(${w / h});`;

  switch (props.char.type) {
    case 'Leaf':
      return <div style={dimStyle} class={props.char.val.color}><span style={textStyle}>{props.char.val.char}</span></div>;
    case '⿰':
    case '⿲':
      return <div class='Row' style={dimStyle}>
        {props.char.args.map(x => <Guess char={x} key={JSON.stringify(x.note.position.y)} />)}
      </div>;
    case '⿱':
    case '⿳':
      return <div class='Col' style={dimStyle}>
        {props.char.args.map(x => <Guess char={x} key={x.note.position.x} />)}
      </div>;
  }
});