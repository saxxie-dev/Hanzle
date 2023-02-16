import { component$, useStore, useStylesScoped$, $, useSignal, useBrowserVisibleTask$, useTask$ } from "@builder.io/qwik";
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
import { InstructionModal } from "../instruction-modal/InstructionModal";
import styles from './App.css?inline';
import { isServer } from '@builder.io/qwik/build';


export const defaultPositions: Position = { x: 0, y: 0, h: 12, w: 12 };



export type AppMode = 'instruction' | 'play' | 'completed';

export default component$(() => {
  useStylesScoped$(styles);

  const currentView = useSignal<AppMode>('play');
  const store = useStore<GameState>(generateFreshGameState());
  useBrowserVisibleTask$(() => {
    if (!localStorage.getItem('wasInstructed')) {
      currentView.value = 'instruction';
    }
    const { secret, secretKnowledge } = generateFreshGameState();
    store.secret = secret;
    store.secretKnowledge = secretKnowledge;

    console.log("Solution: ", store.secret);
  });

  const instructionDialogRef = useSignal<HTMLDialogElement | undefined>();
  useBrowserVisibleTask$(({ track }) => {
    track(() => currentView.value === 'instruction');
    if (!instructionDialogRef.value) { return; }
    if (currentView.value === 'instruction') {
      (instructionDialogRef.value as HTMLDialogElement).showModal();
    } else {
      (instructionDialogRef.value as HTMLDialogElement).close();
    }
  });

  return (<div class="layout">
    <Header help$={$(() => { currentView.value = 'instruction'; })} />
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
        setGuess$={$((g: string): void => { console.log(g); store.pendingGuess = g; })}
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

    <InstructionModal ref={instructionDialogRef} close$={$(() => { currentView.value = 'play' })} />
  </div>
  );
});