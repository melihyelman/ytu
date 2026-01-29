type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;
  
  export default function Button({  className = "", ...rest }: Props) {
    return (
      <div className="md:hidden">
        <button
          {...rest}                      
          className={"p-2 " + className} 
          aria-label={rest["aria-label"] ?? "Open menu"}
        >
        </button>
      </div>
    );
  }
  