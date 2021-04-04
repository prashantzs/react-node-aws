import NProgress from 'nprogress/nprogress';
import Router from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import '../components/styles/nprogress.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}