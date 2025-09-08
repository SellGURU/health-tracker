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
  static getBiomarkersData() {
    return this.post("/biomarkers_mobile", {});
  }
  static getTodayTasks() {
    const response = this.post("/mobile/today_tasks", {});
    return response;
  }
  static checkTask(data: { task_id: string }) {
    const response = this.post("/mobile/check_task", data);
    return response;
  }
  static uncheckTask(data: { task_id: string }) {
    const response = this.post("/mobile/uncheck_task", data);
    return response;
  }
  static updateValue(data: { task_id: string; temp_value: number }) {
    const response = this.post("/mobile/update_value", data);
    return response;
  }
  static getWeeklyTasks() {
    const response = this.post("/mobile/weekly_tasks", {});
    return response;
  }
  static getClientInformation() {
    const response = this.post("/client_information_mobile", {});
    return response;
  }
  static getEducationalContent() {
    const response = this.post("/mobile/educational_content", {});
    return response;
  }
}

export default Application;
