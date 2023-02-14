import { component$, useStore, useStylesScoped$, $, useClientEffect$ } from "@builder.io/qwik";
import type { GameState } from "~/logic/GameState";
import { generateFreshGameState, updatePreviewMap } from "~/logic/GameState";
import { giveHint } from "~/logic/Hints";
import type { Position } from "~/logic/Scoring";
import { generateRenderableIDSGuess } from "~/logic/Scoring";
import Footer from "../footer/Footer";
import { Guess } from "../guess/Guess";
import { Hint } from "../guess/Hint";
import Header from "../header/Header";
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
    console.log(store.secret, store.secretKnowledge);
  });


  return (<div class="layout">
    <Header />
    <section class='guessGrid'>
      {store.previousGuesses.map((guess, i) => {
        switch (guess.type) {
          case "Guess":
            return <div class='previousGuess'><Guess key={i} char={generateRenderableIDSGuess(guess.value, store.secretKnowledge)} /></div>;
          case "Hint":
            return <div class='previousGuess'><Hint key={i} char={guess.value} position={guess.position} /></div>;
        }
      }
      )}
      <NewInput
        guess={store.pendingGuess}
        publicKnowledge={store.publicKnowledge}
        setGuess$={$((g: string): void => { store.pendingGuess = g; })}
        submit$={$(() => {
          store.previousGuesses = [...store.previousGuesses, { type: "Guess", value: store.pendingGuess }];
          store.publicKnowledge = updatePreviewMap(store.publicKnowledge, store.secretKnowledge, store.pendingGuess);
          store.pendingGuess = "";
          if (store.pendingGuess === store.secret) {
            alert("You did it");
          }
        })} />
      <button class="giveHint" onClick$={() => {
        store.previousGuesses = [...store.previousGuesses, giveHint(store.secretKnowledge, store.publicKnowledge)];
      }}><ruby>线索<rt>Hint</rt></ruby></button>
    </section>
    <Footer />
  </div>
  );
});