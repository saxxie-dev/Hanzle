import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from './Header.css?inline';


export default component$((props: { help$: () => void }) => {
  useStylesScoped$(styles);
  return <header><span><a href="https://hanzle.saxxie.dev">汉字le</a> - like wordle, but for 简体中文字</span><span class="help" onClick$={props.help$}>?</span></header>;
})