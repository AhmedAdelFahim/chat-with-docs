import { IInputChangedValue } from "./input.interface";

interface IAppInputProps {
    onChange: (changedValue: IInputChangedValue) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    name: string,
    label?: string,
    placeholder?: string,
    type: 'password' | 'text' | 'email',
    disabled?: boolean,
}

export default function AppInput(props: IAppInputProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
      e.preventDefault()
      console.log(e.target.value)
        props.onChange({value: e.target.value, name: props.name});
    }
    return (
      <div className='p-2 d-flex flex-column w-100'>
        {props.label && <label>{props.label}</label>}
        <input disabled={props.disabled} value={props.value} placeholder={props.placeholder} className="mt-2 p-1" type={props.type} onChange={handleChange}/>
      </div>
    );
  }
  