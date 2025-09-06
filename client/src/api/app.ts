/* eslint-disable @typescript-eslint/no-unused-vars */
import Api from "./api";

interface SendMessageProps {
  conversation_id: number;
  images?: [];
  message_to: "ai" | "coach";
  text: string;
}
class Application extends Api {
  // static getPatients() {
  //   const response = this.get("/patients");
  //   return response;
  // }

  static getMessagesId(data: { message_from: "ai" | "coach" }) {
    const response = this.post("/mobile_chat/get_messages_id", data);
    return response;
  }
  static sendMessage(data: SendMessageProps) {
    const response = this.post("/mobile_chat", data);
    return response;
  }
}

export default Application;
