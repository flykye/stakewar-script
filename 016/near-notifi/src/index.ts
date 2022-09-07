import {
  NotifiClient,
  NotifiEnvironment,
  createAxiosInstance,
} from "@notifi-network/notifi-node";
import axios from "axios";
import { config } from "dotenv";

config({ path: ".env" });

const { SID, SECRET, TOPIC, NODE_IP, POOL_ID } = process.env;

const env: NotifiEnvironment = "Development";
const axiosInstance = createAxiosInstance(axios, env);
const client = new NotifiClient(axiosInstance);

const findMyPool = (pool: any) => pool.account_id === POOL_ID;


function changeToNear(yoctoNear: number) {
  return Math.round(yoctoNear / 10e23) || "??";
}


async function getAllValidator(node_ip?: string) {
  const url = "http://" + node_ip + ":3030"
  const data = {
    jsonrpc: "2.0",
    id: "dontcare",
    method: "validators",
    params: [null],
  };
  const response = await axios.post(url, data);
  return response.data;
}

const main = async () => {
  try {
    const { token } = await client.logIn({
      sid: SID as string,
      secret: SECRET as string,
    });

    const { result } = await getAllValidator(NODE_IP);

    const myValidator = result.current_validators?.find(findMyPool);
    const nextEpochSeatPrice = result.current_validators?.reduce(
      (lowerValue: number, pool: any) => {
        if (Number(pool.stake) < Number(lowerValue)) return pool.stake;
        else return lowerValue;
      },
      result.next_validators?.[0]?.stake
    );

    await client.sendBroadcastMessage(token, {
      topicName: TOPIC as string,
      variables: [
        {
          key: "subject",
          value: `👷‍♂️ Validator ${POOL_ID} total stake is: ${changeToNear(
            myValidator?.stake
          )} Near`,
        },
        {
          key: "message",
          value: `Next epoch seat price is: ${changeToNear(
            nextEpochSeatPrice
          )} Near`,
        },
      ],
    });
  } catch (error: any) {
  }
};

main();
