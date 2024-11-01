import {Initializable} from "./initializable";
import {RestFetch} from "../common/fetch";
export class Mediator implements Initializable {
    private static MEDIATOR_URL: string = process.env.MEDIATOR_URL || "http://localhost:8080"
    private static MEDIATOR_OOB_URL = process.env.MEDIATOR_OOB_URL || "http://localhost:8080/invitationOOB"
    private restFetch = new RestFetch(Mediator.MEDIATOR_URL)

    async init(): Promise<void> {
        let healthResponse = await this.restFetch.get('/health');
        if (healthResponse.status != 200) {
            throw new Error("Mediator is not healthy")
        }
    }

    async getMediatorDidThroughOob() {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const response = await (await fetch(Mediator.MEDIATOR_OOB_URL, requestOptions)).text()
        const encodedData = response.split("?_oob=")[1]
        const oobData = JSON.parse(Buffer.from(encodedData, "base64").toString())
        return oobData.from
    }
}
