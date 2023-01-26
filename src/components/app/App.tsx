import { component$, useStore, useStylesScoped$, $ } from "@builder.io/qwik";
import { GameState, generateFreshGameState } from "~/logic/GameState";
import { generateRenderableIDSGuess, Position } from "~/logic/Scoring";
import { Guess } from "../guess/Guess";
import Input from "../input/input";
import styles from './App.css?inline';


export const defaultPositions: Position = { x: 0, y: 0, h: 12, w: 12 };

export default component$(() => {
  useStylesScoped$(styles);

  const store = useStore<GameState>(generateFreshGameState());
  console.log(JSON.stringify(store));

  const submitGuess = () => {
    const { pendingGuess } = store;
    // guesses = guesses.push(pendingGuess)
    if (pendingGuess === store.secret) {
      alert("You did it");
      store.pendingGuess = "";
    }
  }


  return (
    <div>
      <section>
        {//store.guesses.map(g => <Guess char={g} />)}
        }
        <Guess char={generateRenderableIDSGuess(store.pendingGuess, store.secretKnowledge)} />
      </section>
      ({store.secret});
      <Input guess={store.pendingGuess} setGuess$={$((g: string): void => { store.pendingGuess = g; })} />
    </div>
  );
});