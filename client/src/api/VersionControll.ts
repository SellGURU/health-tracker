import axios from "axios";

class VersionControll {
    protected static base_url: string =
    'https://marketing-vercel-one.vercel.app/test_dashboard';

    protected static get(url: string, config?: any) {
        const response = axios.get(this.base_url + url, {
        headers: {
            "Content-Type": config?.headers?.["Content-Type"] || "application/json",
        },
        });
        return response;
    }    

    public static getConfig= ()=>{
        return this.get("/config");
    }
}

export default VersionControll;