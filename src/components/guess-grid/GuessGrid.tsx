import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { Queries } from "~/logic/queries";
import { IDS } from "~/logic/types";
import styles from './Guess.css?inline';


export type GuessGridProps = {
  char: IDS.Expr<string, Queries.Position>
}

export const GuessGrid = component$((props: GuessGridProps) => {
  useStylesScoped$(styles);

  return null;
});