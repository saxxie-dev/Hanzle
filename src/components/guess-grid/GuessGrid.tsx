import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { IDS } from "~/logic/IDS";
import { Position } from "~/logic/Scoring";
import styles from './Guess.css?inline';


export type GuessGridProps = {
  char: IDS.Expr<string, Position>
}

export const GuessGrid = component$((props: GuessGridProps) => {
  useStylesScoped$(styles);

  return null;
});