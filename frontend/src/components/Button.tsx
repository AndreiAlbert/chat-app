interface ButtonComponentProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type: "button" | "submit";
}


export function Button({ children, onClick, disabled, type }: ButtonComponentProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
