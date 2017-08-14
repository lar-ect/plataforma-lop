import hljs from 'highlight.js/lib/highlight';
import 'highlight.js/styles/solarized-dark.css';

hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));

hljs.initHighlightingOnLoad();