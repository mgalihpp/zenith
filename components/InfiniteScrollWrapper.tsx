import { useInView } from 'react-intersection-observer';

type InfiniteScrollWrapperProps = {
  children: React.ReactNode;
  onBottomReached: () => void;
  className?: string;
};

export default function InfiniteScrollWrapper(
  props: InfiniteScrollWrapperProps
) {
  const { ref } = useInView({
    rootMargin: '200px',
    onChange: (view) => {
      if (view) {
        props.onBottomReached();
      }
    },
  });

  return (
    <div className={props.className}>
      {props.children}
      <div ref={ref}></div>
    </div>
  );
}
