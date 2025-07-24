import Errors from "components/admin/FormItems/error/errors";
import axios from "axios";
import config from "constants/config";

async function list() {
  const response = await axios.get(`/products`);
  return response.data;
}

export default { list };
