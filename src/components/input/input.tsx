import { component$ } from "@builder.io/qwik";

export default component$(() => {

  return <input
    onCompositionEnd$={e => console.log("composition end" + e.data)}
    onInput$={e => console.log("input" + (e.target as any).value)} />;

});