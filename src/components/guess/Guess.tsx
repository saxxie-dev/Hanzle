import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Queries } from "~/logic/queries";
import { IDS } from "~/logic/types";
import styles from './Guess.css?inline';


export type GuessProps = {
  char: IDS.Expr<[Queries.LeafMatch, string], Queries.Position>
}

export const Guess = component$((props: GuessProps) => {
  useStylesScoped$(styles);
  const { x, y, w, h } = props.char.note;
  const dimStyle = `width: ${w}rem; 
    height: ${h}rem;`
  const textStyle = `
    line-height:${h}rem;
    font-size: ${h}rem;
    transform: scaleX(${w / h});`

  switch (props.char.type) {
    case 'Leaf':
      return <div style={dimStyle} class={props.char.val[0]}><span style={textStyle}>{props.char.val[1]}</span></div>;
    case '⿰':
    case '⿲':
      return <div class='Row' style={dimStyle}>
        {props.char.args.map(x => <Guess char={x} />)}
      </div>;
    case '⿱':
    case '⿳':
      return <div class='Col' style={dimStyle}>
        {props.char.args.map(x => <Guess char={x} />)}
      </div>;
  }
});