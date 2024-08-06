
interface CustomInputProps {
  type: string;
  placeHolder: string;
  value: string;
  name: string;
  onChanghe: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomInput({ ...props }: CustomInputProps) {
  return (
    <>
      <div className="input_wrapper">
        <input
          type={props.type}
          placeholder={props.placeHolder}
          onChange={props.onChanghe}
          name={props.name}
        />
      </div>
    </>
  )
}
