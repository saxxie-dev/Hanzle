import { component$, useStore, useStylesScoped$, $, useClientEffect$ } from "@builder.io/qwik";
import { GameState, generateFreshGameState } from "~/logic/GameState";
import { Position } from "~/logic/Scoring";
import NewInput from "../input/NewInput";
import styles from './App.css?inline';


export const defaultPositions: Position = { x: 0, y: 0, h: 12, w: 12 };

export default component$(() => {
  useStylesScoped$(styles);

  const store = useStore<GameState>(generateFreshGameState());
  useClientEffect$(() => {
    const { secret, secretKnowledge } = generateFreshGameState();
    store.secret = secret;
    store.secretKnowledge = secretKnowledge;
    console.log(store.secret);
  });

  const submitGuess = () => {
    const { pendingGuess } = store;
    // guesses = guesses.push(pendingGuess)
    if (pendingGuess === store.secret) {
      alert("You did it");
      store.pendingGuess = "";
    }
  }


  return (
    <div class='verticalAlign'>
      <div class='horizontalAlign'>
        <NewInput guess={store.pendingGuess} secretKnowledge={store.secretKnowledge} setGuess$={$((g: string): void => { store.pendingGuess = g; })} />
      </div>
    </div>
  );
});