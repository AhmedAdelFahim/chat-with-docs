import styles from "./page.module.css";
import AskByTextBtn from "./send-txt-btn";

// eslint-disable-next-line @typescript-eslint/ban-types
export default function ChatController(props: { btnDisabled: boolean, question: string, handleQuestionChange: (q:string) => void, handleAskByTextOnClick: () => void }) {
    console.log(props.btnDisabled)
    return (
      <div className={styles.chat_controller_container}>
        <textarea value={props.question} className={styles.chat_controller_text_input} onChange={(e) => {
            props.handleQuestionChange(e.target.value)
        }}>
        </textarea>
        <div className={styles.chat_controller_buttons}>
        <AskByTextBtn disabled={props.btnDisabled} onClick={props.handleAskByTextOnClick}/>
        <button type="button" className="btn btn-dark">Record</button>
        </div>
      </div>
    );
  }
  