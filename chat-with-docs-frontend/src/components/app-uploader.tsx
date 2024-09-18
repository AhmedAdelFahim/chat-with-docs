import { IInputChangedValue } from "./input.interface";

interface IAppUploaderProps {
    
    onChange: (changedValue: IInputChangedValue) => void,
    // value: any,
    name: string,
    label?: string,
    accept: string,
}

export default function AppUploader(props: IAppUploaderProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
      e.preventDefault()

        props.onChange({
          value: e.target.files[0],
          name: props.name,
        });
    }
    return (
      <div className='p-2 d-flex flex-column w-100'>
        {props.label && <label>{props.label}</label>}
        <input accept={props.accept} className="mt-2" type='file' onChange={handleChange}/>
      </div>
    );
  }
  