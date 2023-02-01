import { component$, useStore, useStylesScoped$, $, useClientEffect$ } from "@builder.io/qwik";
import { GameState, generateFreshGameState, updatePreviewMap } from "~/logic/GameState";
import { generateRenderableIDSGuess, Position } from "~/logic/Scoring";
import { Guess } from "../guess/Guess";
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


  return (
    <div class='guessGrid'>
      {store.previousGuesses.map((guess, i) => (
        <div class='previousGuess'><Guess key={i} char={generateRenderableIDSGuess(guess, store.secretKnowledge)} /></div>))}
      <NewInput
        guess={store.pendingGuess}
        publicKnowledge={store.publicKnowledge}
        setGuess$={$((g: string): void => { store.pendingGuess = g; })}
        submit$={$(() => {
          console.log("submit!", store.pendingGuess, store.secret);
          store.previousGuesses = [...store.previousGuesses, store.pendingGuess];
          store.publicKnowledge = updatePreviewMap(store.publicKnowledge, store.secretKnowledge, store.pendingGuess);
          store.pendingGuess = "";
          if (store.pendingGuess === store.secret) {
            alert("You did it");
          }
        })} />
    </div>
  );
});