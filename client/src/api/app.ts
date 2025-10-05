/* eslint-disable @typescript-eslint/no-unused-vars */
import Api from "./api";

interface SendMessageProps {
  conversation_id: number;
  images?: [];
  message_to: "ai" | "coach";
  text: string;
}
interface getExerciseFileProps {
  file_id: string;
  encoded_mi: string;
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
  static feeedBack(feed: "like" | "dislike", conversation_id: number) {
    const response = this.post("/mobile_chat/feedback", {
      feedback: feed,
      current_conversation_id: conversation_id,
    });
    return response;
  }
  static reportMessage(
    current_conversation_id: number,
    issue_text: string,
    reason: string
  ) {
    const response = this.post("/mobile_chat/report", {
      reason: reason,
      issue_text: issue_text,
      current_conversation_id: current_conversation_id,
    });
    return response;
  }
  static updatePersonalInfo(data: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
  }) {
    const response = this.post("/mobile/update_personal_info", data);
    return response;
  }
  static showExerciseFile = (data: getExerciseFileProps) => {
    return this.post("/mobile/show_exercise_file", data);
  };
  static getAssignedQuestionaries() {
    const response = this.post("/mobile/tasks/show_assigned_questionaries", {});
    return response;
  };
  static addEvent = (data: any) => {
    return this.post("/mobile/add_event", data);
  };
  static connectVariable = (device:string) => {
    return this.post("/mobile/settings/connect_device",{
      connected_device:device
    })
  }  
  static disConnectVariable = (device:string) => {
    return this.post("/mobile/settings/disconnect_device",{
      disconnected_device:device
    })
  }  
  static getHolisticPlanActionPlan() {
    const response = this.post("/mobile/holistic_plan_action_plan", {});
    return response;
  };
  static changePassword(data:any) {
    const response = this.post("/mobile/auth/change_password", data);
    return response;
  };

  static savePrivacy(data:any) {
    const response = this.post("/mobile/save_privacy_settings", data);
    return response;
  };
  static showPrivacy(data:any) {
    const response = this.post("/mobile/show_privacy_settings", data);
    return response;
  };

  static saveNotifications(data:any) {
    const response = this.post("/mobile/save_notification_settings", data);
    return response;
  };
  static showNotifications(data:any = {}) {
    const response = this.post("/mobile/show_notification_settings", data);
    return response;
  };
  static saveNotifSettings(data:any) {
    const response = this.post("/mobile/save_notification_settings", data);
    return response;
  };

}

export default Application;
