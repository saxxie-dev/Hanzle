import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { githubIcon } from "../img/github";
import styles from './Footer.css?inline';


export default component$(() => {
  useStylesScoped$(styles);
  return <footer>© 2023 <a href="https://saxxie.dev">saxxie.dev</a>&nbsp; &nbsp; <a href="https://github.com/saxxie-dev/hanzle">{githubIcon()}</a></footer>;
});