import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { SmallRadicalClass, SmallRadicals } from "~/logic/Radicals";
import type { ColorizedIDS } from "~/logic/Scoring";
import styles from './Guess.css?inline';
import { ResultLeaf } from "./ResultLeaf";


export type GuessProps = {
  char: ColorizedIDS<string>; // IDK how to make type-polymorphic components with qwik
}

export const Guess = component$((props: GuessProps) => {
  useStylesScoped$(styles);
  const { w, h } = props.char.note.position;
  const dimStyle = `width: ${w}rem;
  height: ${h}rem;`;

  switch (props.char.type) {
    case 'Leaf':
      return <ResultLeaf
        radical={props.char.val.char}
        width={w}
        height={h}
        color={props.char.val.color} />;
    case '⿰':
    case '⿲':
      return <div class='Row' style={dimStyle}>
        {props.char.args.map(x => <Guess char={x} key={x.note.position.x} />)}
      </div>;
    case '⿱':
    case '⿳':
      return <div class='Col' style={dimStyle}>
        {props.char.args.map(x => <Guess char={x} key={x.note.position.y} />)}
      </div>;
    case '⿺':
    case '⿹':
    case '⿸':
    case '⿶':
    case '⿵':
    case '⿷':
    case '⿴':
      const offsetX = props.char.args[1].note.position.x - props.char.note.position.x;
      const offsetY = props.char.args[1].note.position.y - props.char.note.position.y;
      const innerStyle = `top: ${offsetY}rem; left: ${offsetX}rem;`
      return <div class="Outer" style={dimStyle}>
        <Guess char={props.char.args[0]} />
        <div class="Inner" style={innerStyle}>
          <Guess char={props.char.args[1]} />
        </div>
      </div>;
  }
});

