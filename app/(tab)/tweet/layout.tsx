export default function TweetLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
