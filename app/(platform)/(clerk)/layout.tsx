interface ClerkLayoutProps {
  children: React.ReactNode;
}

function ClerkLayout({ children }: ClerkLayoutProps) {
  return (
    <div className="h-full flex items-center justify-center">{children}</div>
  );
}

export default ClerkLayout;
