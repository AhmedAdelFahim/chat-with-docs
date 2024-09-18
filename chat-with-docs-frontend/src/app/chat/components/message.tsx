import styles from "./page.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Message(props: { actorType: 'USER' | 'AI', message: any, messageType: 'TEXT' | 'AUDIO' }) {
    return (
      <div className={props.actorType === 'AI' ? styles.ai_message_container : styles.user_message_container}>
        {props.messageType === 'TEXT'  ? <pre className={props.actorType === 'AI' ?  styles.ai_message:  styles.user_message}>
            {props.message}
        </pre> : <audio controls>
            <source type="audio/x-wav" src={URL.createObjectURL(props.message)}>
            </source>
          </audio>}
      </div>
    );
  }
  