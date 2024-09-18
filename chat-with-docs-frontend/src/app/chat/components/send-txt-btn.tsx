
export default function AskByTextBtn(props: { disabled: boolean, onClick: () => void }) {

    return (
      <button onClick={props.onClick} disabled={props.disabled} type="button" className="btn btn-dark">Send</button>
    );
  }
  