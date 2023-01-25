import { component$, useStore, useStylesScoped$, $ } from "@builder.io/qwik";
import { Queries } from "~/logic/queries";
import { IDS } from "~/logic/types";
import { Guess } from "../guess/Guess";
import Input from "../input/input";
import styles from './App.css?inline';

type State = {
  guesses: IDS.Expr<[Queries.LeafMatch, string], Queries.Position>[];
  knownPositions: Record<string, Queries.Position>;
  pendingGuess: string;
}

export const defaultPositions: Queries.Position = { x: 0, y: 0, h: 12, w: 12 };

export default component$(() => {
  useStylesScoped$(styles);

  const secretCharacter = '汉';
  const secretPositions: Record<string, Queries.Position> = Queries.findComponentPositions(secretCharacter, defaultPositions);
  const store = useStore<State>({
    guesses: [],
    knownPositions: {},
    pendingGuess: "",
  });

  const submitGuess = () => {
    const { pendingGuess, guesses } = store;
    // guesses = guesses.push(pendingGuess)
    if (pendingGuess === secretCharacter) {
      alert("You did it");
      store.pendingGuess = "";
    }
  }


  return (
    <div>
      <section>
        {store.guesses.map(g => <Guess char={g} />)}
      </section>
      <Input guess={store.pendingGuess} setGuess$={$((g: string): void => { store.pendingGuess = g; })} />
    </div>
  );
});