import { useIsFetching } from '@tanstack/react-query';

export default function Header({ children }) {
  const fetching = useIsFetching();
  return (
    <>
      <div id="main-header-loading"></div>
      {fetching > 0 && <progress/>}
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
