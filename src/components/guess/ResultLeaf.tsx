import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { SmallRadicalClass, SmallRadicals } from "~/logic/Radicals";
import styles from './Guess.css?inline';


export type LeafProps = {
  radical: string;
  color: string;
  width: number;
  height: number;
}

export const ResultLeaf = component$((props: LeafProps) => {
  useStylesScoped$(styles);

  const { width: w, height: h, color, radical } = props;
  const dimStyle = `width: ${w}rem;
  height: ${h}rem;
  ${SmallRadicals[radical] === SmallRadicalClass.right ? "direction: rtl;" : ""}`;

  const getTextStyle = (char: string): string => {
    switch (SmallRadicals[char]) {
      case undefined:
        return `
        line-height:${h}rem;
        font-size: ${h * 0.95}rem;
        transform: scaleX(${w / h});`;
      case SmallRadicalClass.left:
        return `
        line-height:${h}rem;
        font-size: ${h * 0.95}rem;
        transform: scaleX(${2 * w / h});`;
      case SmallRadicalClass.right:
        return `
        line-height:${h}rem;
        font-size: ${h * 0.95}rem;
        direction: rtl;
        transform-origin: top right;
        transform: scaleX(${2 * w / h});`;
      case SmallRadicalClass.top:
        return `
          line-height:${h}rem;
          font-size: ${h * 0.95}rem;
          transform: scaleX(${w / h}) scaleY(1.5);`;
      case SmallRadicalClass.bottom:
        return `
          line-height:${h}rem;
          font-size: ${h * 0.95}rem;
          transform: scaleX(${w / h}) scaleY(1.5) translateY(${-h / 2}rem);`;
    }
  };
  return <div style={dimStyle} class={color}>
    <span style={getTextStyle(radical)}>
      {radical}
    </span></div>;
});