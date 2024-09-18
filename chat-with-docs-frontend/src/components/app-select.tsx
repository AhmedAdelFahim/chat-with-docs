import Select from 'react-select';

export interface IOption { value: string, label: string }

interface IAppSelectProps {
    options: IOption[],
    defaultOptions?: IOption,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (selectedOption: IOption) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    name?: string,
    label?: string,
}

export default function AppSelect(props: IAppSelectProps) {
    const handleChange = (selected: IOption) => {
        props.onChange(selected);
    }
    return (
      <div className='p-2 w-100'>
        {props.label && <label>{props.label}</label>}
        <Select
        value={props.value}
        onChange={handleChange}
        options={props.options}
        name={props.name}
        defaultValue={props?.defaultOptions || null}
      />
      </div>
    );
  }
  