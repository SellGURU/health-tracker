/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from "./api";
class Application extends Api {
  static getPatients() {
    const response = this.get("/patients");
    return response;
  }

  static getPatientsInfo(data: any) {
    const response = this.post("/patients/patient_data", data);
    return response;
  }
}

export default Application;
