import AppLayout from "@/components/app-layout";
import ChatForm from "./components/chat-form";

export default function ChatPage() {
  return (
    <AppLayout selectedPage={"CHAT_PAGE"}>
      <ChatForm/>
    </AppLayout>
    
  );
}
